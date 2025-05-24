import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import { GameStepEnum } from "../../Enums/BetNRun2/GameStepEnum";
import { ImageHelper } from "../../Helpers/ImageHelper";
import { Background } from "../../models/BetNRun2/Background";
import { Crate, CrateTypeEnum } from "../../models/BetNRun2/Crate";
import { Player } from "../../models/BetNRun2/Player";
import { BinaryResultService } from "../BinaryResultService";
import { ClockService } from "../ClockService";

export class BetNRun2Service {
  private scene: Phaser.Scene;
  private background: Background;
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
  
  constructor(scene: Phaser.Scene) {
    this.clockService = new ClockService();
    this.scene = scene;
    this.background = new Background(this.scene, this.scene.textures.get(AssetKeyEnum.background));
    this.player = new Player(this.scene, this.background, this.scene.textures.get(ImageHelper.getFirstFrameOfPngSequenceTextures(AssetKeyEnum.standingPlayer)), this.clockService);
    this.crates = [];
    this.binaryResultService = new BinaryResultService();
    
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
    this.player.update();
    this.crates.forEach(crate => crate.update());
  }
  proceedGameButton() {
    this.raiseBet();
    this.placeBet();
    this.proceedRestartGame();
  }
  destroyGameObjects() {
    this.player.destroy(true);
    this.background.destroy(true);
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
      this.setNextGameStep(GameStepEnum.awaitingRaiseBet);
    }
  }
  placeBet() {
    if(this.gameStep === GameStepEnum.awaitingBet){
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
  }
  
  createPlayer() {
    this.player.create();
  }
}
