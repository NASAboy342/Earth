import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import { GameStepEnum } from "../../Enums/BetNRun2/GameStepEnum";
import { ImageHelper } from "../../Helpers/ImageHelper";
import { Background } from "../../models/BetNRun2/Background";
import { Crate, CrateTypeEnum } from "../../models/BetNRun2/Crate";
import { Player } from "../../models/BetNRun2/Player";
import { Tiles } from "../../models/BetNRun2/Tiles";
import { BinaryResultService } from "../BinaryResultService";
import { ClockService } from "../ClockService";
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

  
  constructor(scene: Phaser.Scene, playerService: PlayerService) {
    this.clockService = new ClockService();
    this.scene = scene;
    this.background = new Background(this.scene, this.scene.textures.get(AssetKeyEnum.dayBackground));
    var fistTile = new Tiles(this.scene, this.scene.textures.get(AssetKeyEnum.backgroundMainHouse), 0, this.scene.cameras.main.height, true, 0, this.clockService);
    this.tiles.push(fistTile);
    this.player = new Player(this.scene, this.background, this.scene.textures.get(ImageHelper.getFirstFrameOfPngSequenceTextures(AssetKeyEnum.standingPlayer)), this.clockService, this.tiles);
    this.crates = [];
    this.binaryResultService = new BinaryResultService();
    this.playerService = playerService;
    
    this.spaceKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
  cashOut() {
    if(this.gameStep === GameStepEnum.cashOut){
      this.playerService.settle(this.playerService.stake * (this.binaryResultService.stakeMultiplier * this.binaryResultService.stakeMultiplyRate));
      this.setNextGameStep(GameStepEnum.proceedStartNewGame);
    }
  }
  cashingOut() {
    if(this.gameStep === GameStepEnum.cashingOut){
      this.setNextGameStep(GameStepEnum.cashOut);
    }
  }
  minusStake() {
    if(this.gameStep === GameStepEnum.awaitingBet && this.playerService.stake >= 0){
      this.playerService.stake -=  Phaser.Math.RoundTo(this.playerService.stake * 0.5, -2);
    }
  }
  addStake() {
    if(this.gameStep === GameStepEnum.awaitingBet){
      console.log(Phaser.Math.RoundTo((this.playerService.stake === 0 ? 1 : this.playerService.stake) * 0.5, -2));
      this.playerService.stake += Phaser.Math.RoundTo((this.playerService.stake === 0 ? 1 : this.playerService.stake) * 0.5, -2);
    }
  }
  proceedCashOut() {
    if(this.gameStep === GameStepEnum.awaitingRaiseBet){
      this.setNextGameStep(GameStepEnum.cashingOut)
    }
  }
  proceedGameButton() {
    this.raiseBet();
    this.placeBet();
    this.proceedRestartGame();
  }
  destroyGameObjects() {
    this.player.destroy(true);
    this.background.destroy(true);
    this.tiles.forEach(tile => tile.destroy(true));
    this.crates.forEach(crate => crate.destroy(true));
  }
  proceedRestartGame() {
    if(this.gameStep === GameStepEnum.gameOver){
      this.gameStep = GameStepEnum.proceedStartNewGame;
    }
  }
  gameOver() {
    if(this.gameStep === GameStepEnum.gameOver){
      if(!this.isRestartGameClockStarted){
        this.restartGameClockStartAt = this.clockService.TimeSpentInSeconds
        this.isRestartGameClockStarted = true;
      }
      if(this.timeToRestartGame()){
        this.playerService.settle(-this.playerService.stake);
        this.proceedRestartGame();
      }
    }
  }
  timeToRestartGame(): boolean {
    return this.clockService.TimeSpentInSeconds - this.restartGameClockStartAt >= this.restartGameInSecond;
  }
  settleBet() {
    if(this.gameStep === GameStepEnum.settlingBet){
      if(this.player.isOnTargetTile()){
        let isWin = this.binaryResultService.getResult();
        if(isWin){
          this.setNextGameStep(GameStepEnum.betSettledWin);
        }
        else{
          this.setNextGameStep(GameStepEnum.betSettledLose);
        }
      } 
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
  placeBet() {
    if(this.gameStep === GameStepEnum.awaitingBet){
      this.playerService.deduct(this.playerService.stake);
      this.setNextGameStep(GameStepEnum.awaitingRaiseBet);
    }
  }
  awaitForBet() {
    if(this.gameStep === GameStepEnum.start){
      this.setNextGameStep(GameStepEnum.awaitingBet);
    }
  }
  raiseBet() {
    if (this.gameStep === GameStepEnum.awaitingRaiseBet){
      this.setNextGameStep(GameStepEnum.settlingBet);
      this.movePlayerToNextPosition();
    }
  }
  setNextGameStep(newGameStep: GameStepEnum) {
    this.gamePreviousStep = this.gameStep;
    this.gameStep = newGameStep;
    console.log("Game Step: " + GameStepEnum[this.gameStep]);
  }
  movePlayerToNextPosition() {
    this.player.moveToNextTile(1);
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
