import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import { GameStepEnum } from "../../Enums/BetNRun2/GameStepEnum";
import { ImageHelper } from "../../Helpers/ImageHelper";
import { Background } from "../../models/BetNRun2/Background";
import { Crate, CrateTypeEnum } from "../../models/BetNRun2/Crate";
import { Player } from "../../models/BetNRun2/Player";
import { Tiles } from "../../models/BetNRun2/Tiles";
import { BetAndRunLoginRequest } from "../../models/EarthApi/BetAndRunLoginRequest";
import { GetBetResultRequest } from "../../models/EarthApi/GetBetResultRequest";
import { MoveToNextTileRequest } from "../../models/EarthApi/MoveToNextTileRequest";
import { PlaceBetRequest } from "../../models/EarthApi/PlaceBetRequest";
import { SetNextGameStateRequest } from "../../models/EarthApi/SetNextGameStateRequest";
import { SettleBetRequest } from "../../models/EarthApi/SettleBetRequest";
import { BinaryResultService } from "../BinaryResultService";
import { ClockService } from "../ClockService";
import { EarthApiService } from "../EarthApiService";
import type { PlayerService } from "../PlayerService";

export class BetNRun2Service {
  
  private scene: Phaser.Scene;
  private background: Background;
  private tiles: Tiles[] = [];
  private player: Player;
  private crates: Crate[];
  spaceKey: Phaser.Input.Keyboard.Key;
  gameStep: GameStepEnum = GameStepEnum.start;
  gamePreviousStep: GameStepEnum = GameStepEnum.none;
  binaryResultService: BinaryResultService;
  isCrateOnPlayerSpawned: boolean = false;
  clockService: ClockService;
  isRestartGameClockStarted: boolean = false;
  restartGameClockStartAt: number = 0;
  restartGameInSecond: number = 5;
  playerService: PlayerService;
  tileCount: number = 15;
  earthApiService: EarthApiService;
  sessionId: string = "";
  isSetNextGameDone: boolean = true;
  isPlaceBetDone: boolean = true;
  isSettleDone: boolean = true;
  isSyncedGameStep: boolean = true;
  isGetBetResultDone: boolean = true;
  isMovePlayerToNextTileDone: boolean = true;

  
  constructor(scene: Phaser.Scene, playerService: PlayerService) {
    this.clockService = new ClockService();
    this.scene = scene;
    this.background = new Background(this.scene, this.scene.textures.get(AssetKeyEnum.dayBackground), playerService);
    var fistTile = new Tiles(this.scene, this.scene.textures.get(AssetKeyEnum.backgroundMainHouse), 0, this.scene.cameras.main.height, true, 0, this.clockService);
    this.tiles.push(fistTile);
    this.player = new Player(this.scene, this.background, this.scene.textures.get(ImageHelper.getFirstFrameOfPngSequenceTextures(AssetKeyEnum.standingPlayer)), this.clockService, this.tiles);
    this.crates = [];
    this.binaryResultService = new BinaryResultService();
    this.playerService = playerService;
    
    this.spaceKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.earthApiService = new EarthApiService();

    this.loginGameSession("DemoPlayer");
  }
  async loginGameSession(username: string) {
    let request = new BetAndRunLoginRequest();
    request.username = username;
    let loginResponse = await this.earthApiService.BetAndRunLogin(request);
    if(loginResponse.errorCode !== 0){
      console.error("Failed to login:", loginResponse.errorMessage);
      return;
    }
    this.gamePreviousStep = loginResponse.responseData.previousGameState;
    this.gameStep = loginResponse.responseData.gameState;
    this.sessionId = loginResponse.responseData.sessionId;
    this.binaryResultService.stakeMultiplier = this.playerService.stake;
    this.binaryResultService.tileCount = this.tileCount;
    this.binaryResultService.reachableTile = loginResponse.responseData.currentTile;
  }
  update() {
    this.clockService.Tick();
    this.awaitForBet();
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.proceedGameButton();
    }
    this.settleBet();
    this.settleGameLose();
    this.settleGameWin();
    this.gameOver();
    this.cashingOut();
    this.cashOut();
    this.player.update();
    this.crates.forEach(crate => crate.update());
    this.tiles.forEach(tile => {
      tile.update();
      if (tile.coin && tile.coin.isClicked){
        this.raiseBet();
      }
    });
  }
  getPlayerX(): number {
    return this.player.x;
  }
  async cashOut() {
    if(this.gameStep === GameStepEnum.cashOut){
      await this.GetSettleResult();
      this.setNextGameStep(GameStepEnum.proceedStartNewGame);
    }
  }
  cashingOut() {
    if(this.gameStep === GameStepEnum.cashingOut){
      this.setNextGameStep(GameStepEnum.cashOut);
    }
  }
  minusStake() {
    if(this.gameStep === GameStepEnum.awaitingBet){
      this.playerService.minusStake();
    }
  }
  addStake() {
    if(this.gameStep === GameStepEnum.awaitingBet){
      this.playerService.addStake();
    }
  }
  proceedCashOut() {
    if(this.gameStep === GameStepEnum.awaitingRaiseBet){
      this.setNextGameStep(GameStepEnum.cashingOut)
    }
  }
  proceedGameButton() {
    this.placeBet();
    this.raiseBet();
    this.proceedRestartGame();
  }
  destroyGameObjects() {
    this.player.destroy(true);
    this.background.destroy(true);
    this.tiles.forEach(tile => tile.destroy(true));
    this.crates.forEach(crate => crate.destroy(true));
    this.scene.sound.stopAll();
  }
  proceedRestartGame() {
    if(this.gameStep === GameStepEnum.gameOver){
      this.setNextGameStep(GameStepEnum.proceedStartNewGame);
    }
  }
  async gameOver() {
    if(this.gameStep === GameStepEnum.gameOver){
      if(!this.isRestartGameClockStarted){
        this.restartGameClockStartAt = this.clockService.TimeSpentInSeconds
        this.isRestartGameClockStarted = true;
      }
      if(this.timeToRestartGame()){
        await this.GetSettleResult();
      }
    }
  }
  async GetSettleResult() {
    if(this.isSettleDone){
          this.isSettleDone = false;
  
          let settleBetRequest = new SettleBetRequest();
          settleBetRequest.username = this.playerService.playerInfo.username;
  
          let settleBetResponse = await this.earthApiService.SettleBet(settleBetRequest);
  
          if(settleBetResponse.errorCode !== 0){
            console.error("Failed to settle bet:", settleBetResponse.errorMessage);
            this.isSettleDone = true;
            return;
          }
  
          this.playerService.playerInfo.balance = settleBetResponse.responseData.balance;
          this.playerService.resetStake();
          this.proceedRestartGame();
          this.isSettleDone = true;
        }
  }
  timeToRestartGame(): boolean {
    return this.clockService.TimeSpentInSeconds - this.restartGameClockStartAt >= this.restartGameInSecond;
  }
  settleBet() {
    if(this.gameStep === GameStepEnum.settlingBet){
      if(this.player.isOnTargetTile()){
        this.syncGameStepFromBetResult();
      } 
    }
  }
  async syncGameStepFromBetResult() {
    if(this.isSyncedGameStep){
      this.isSyncedGameStep = false;
      
      let getBetResultRequest = new GetBetResultRequest();
      getBetResultRequest.username = this.playerService.playerInfo.username;

      let getBetResultResponse = await this.earthApiService.GetBetResult(getBetResultRequest);

      if(getBetResultResponse.errorCode !== 0){
        console.error("Failed to get bet result:", getBetResultResponse.errorMessage);
        this.isSyncedGameStep = true;
        return;
      }

      this.gamePreviousStep = getBetResultResponse.responseData.previousGameState;
      this.gameStep = getBetResultResponse.responseData.gameState;
      this.binaryResultService.reachableTile = getBetResultResponse.responseData.currentTile;

      this.isSyncedGameStep = true;
    }
  }
  settleGameLose() {
    if(this.gameStep === GameStepEnum.betSettledLose){
      this.spawnCrateOnPlayer(this.player.x, this.player.y);
      let crateThatIsOnPlayer = this.crates.find(crate => crate.crateId === CrateTypeEnum[CrateTypeEnum.spawnOnPlayer]);
      if(crateThatIsOnPlayer && crateThatIsOnPlayer.isOnGround()){
        this.setNextGameStep(GameStepEnum.gameOver);
      }
    }
  }
  spawnCrateOnPlayer(playerX: number, playerY: number) {
    if(!this.isCrateOnPlayerSpawned){
      let crate = new Crate(this.scene, this.background, CrateTypeEnum[CrateTypeEnum.spawnOnPlayer], this.scene.textures.get(AssetKeyEnum.crate), this.clockService);
      crate.x = playerX;
      this.crates.push(crate);
      crate.create();
      this.isCrateOnPlayerSpawned = true;
    }
  }
  settleGameWin() {
    if(this.gameStep === GameStepEnum.betSettledWin){
      this.player.TargetTile.isPlayerOnTile = true;
      this.setNextGameStep(GameStepEnum.awaitingRaiseBet);
    }
  }
  async placeBet() {
    if(this.gameStep === GameStepEnum.awaitingBet){
      if(this.isPlaceBetDone){
        this.isPlaceBetDone = false;
        
        let placeBetRequest = new PlaceBetRequest();
        placeBetRequest.username = this.playerService.playerInfo.username;
        placeBetRequest.amount = this.playerService.stake;

        let placeBetResponse = await this.earthApiService.BetAndRunPlaceBet(placeBetRequest);

        if(placeBetResponse.errorCode !== 0){
          console.error("Failed to place bet:", placeBetResponse.errorMessage);
          this.isPlaceBetDone = true;
          return;
        }

        this.playerService.playerInfo.balance = placeBetResponse.responseData.balance;

        this.setNextGameStep(GameStepEnum.awaitingRaiseBet);
        this.isPlaceBetDone = true;
      }
    }
  }
  awaitForBet() {
    if(this.gameStep === GameStepEnum.start){
      this.background.playBackgroundMusic();
      this.setNextGameStep(GameStepEnum.awaitingBet);
    }
  }
  async raiseBet() {
    if (this.gameStep === GameStepEnum.awaitingRaiseBet){
      await this.setNextGameStep(GameStepEnum.raisingBet);
      await this.movePlayerToNextPosition();
      await this.setNextGameStep(GameStepEnum.settlingBet);
    }
  }
  async setNextGameStep(newGameStep: GameStepEnum) {
    if(this.isSetNextGameDone){
      this.isSetNextGameDone = false;

      let setNextGameStepRequest = new SetNextGameStateRequest();
      setNextGameStepRequest.username = this.playerService.playerInfo.username;
      setNextGameStepRequest.previousGameState = this.gamePreviousStep;
      setNextGameStepRequest.nextGameState = newGameStep;

      let setNextGameStepResponse = await this.earthApiService.SetNextGameState(setNextGameStepRequest);

      if(setNextGameStepResponse.errorCode !== 0){
        console.error("Failed to set next game step:", setNextGameStepResponse.errorMessage);
        this.isSetNextGameDone = true;
        return;
      }

      this.gamePreviousStep = setNextGameStepResponse.responseData.previousGameState;
      this.gameStep = setNextGameStepResponse.responseData.gameState;
      this.isSetNextGameDone = true;
    }
  }
  async movePlayerToNextPosition() {
    if(this.gameStep === GameStepEnum.raisingBet){
      if(this.isMovePlayerToNextTileDone){
        this.isMovePlayerToNextTileDone = false;

        let moveToNextTileRequest = new MoveToNextTileRequest();
        moveToNextTileRequest.username = this.playerService.playerInfo.username;
        let moveToNextTileResponse = await this.earthApiService.MoveToNextTile(moveToNextTileRequest);

        if(moveToNextTileResponse.errorCode !== 0){
          console.error("Failed to move to next tile:", moveToNextTileResponse.errorMessage);
          this.isMovePlayerToNextTileDone = true;
          return;
        }

        this.player.moveToNextTile(moveToNextTileResponse.responseData.currentTile);
        this.isMovePlayerToNextTileDone = true;
      }
    }
  }
  
  createBackground() {
    this.background.create();
    this.generateTiles();
  }
  generateTiles() {
    let tileValues = this.binaryResultService.getTileValue(this.tileCount);
    for (let i = 0; i < this.tileCount; i++){
      let previousTile = this.tiles[this.tiles.length - 1];
      let nextTile = new Tiles(this.scene, this.scene.textures.get(this.getRandomWallType()), previousTile.x + previousTile.getTileWidth(), this.scene.cameras.main.height, false, tileValues[i], this.clockService);
      this.tiles.push(nextTile);
    }

    this.tiles.forEach(tile => tile.create());
  }
  getRandomWallType(): string | Phaser.Textures.Texture | Phaser.Textures.Frame {
    var randomWallType = Phaser.Math.Between(1, 3);
    switch (randomWallType) {
      case 1:
        return AssetKeyEnum.backgroundWall1;
      case 2:
        return AssetKeyEnum.backgroundWall2;
      case 3:
        return AssetKeyEnum.backgroundWall3;
      default:
        return AssetKeyEnum.backgroundWall3;
    }
  }
  
  createPlayer() {
    this.player.create();
  }
}
