<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import Phaser from "phaser";
import { BetNRun2Service } from "../../Services/BetNRun2/BetNRun2Service";
import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import { ImageHelper } from "../../Helpers/ImageHelper";
import { GameStepEnum } from "../../Enums/BetNRun2/GameStepEnum";
import { PlayerInfo } from "../../models/PlayerInfo";
import { PlayerService } from "../../Services/PlayerService";
import { LoadingScreenHelper } from "../../Helpers/LoadingScreenHelper";

const gameContainer = ref<HTMLElement | null>(null);
const gameStep = ref<GameStepEnum>();
const isGameButtonPress = ref<boolean>(false);
const isCashOutButtonPress = ref<boolean>(false);
const playerInfo = ref<PlayerInfo>();
const stake = ref<number>(0);
const isAddStakeButtonPress = ref<boolean>(false);
const isMinusStakeButtonPress = ref<boolean>(false);

const PressGameButton = () => {
  isGameButtonPress.value = true;
}
const PressCashOutButton = () => {
  isCashOutButtonPress.value = true;
}
const PressAddStakeButton = () => {
  isAddStakeButtonPress.value = true;
}
const PressMinusStakeButton = () => {
  isMinusStakeButtonPress.value = true;
}

class GameScene extends Phaser.Scene {
  private betNRun2Service: BetNRun2Service;
  private playerService: PlayerService;

  constructor() {
    super({ key: "GameScene" });
  }
  
  preload() {
    LoadingScreenHelper.create(this);
    this.loadTextures();
  }
  
  create() {
    ImageHelper.createAnimationFromExistingPngSequenceTextures(AssetKeyEnum.standingPlayer, 50, this);
    ImageHelper.createAnimationFromExistingPngSequenceTextures(AssetKeyEnum.runningPlayer, 50, this, 60);
    this.playerService = new PlayerService();
    this.startNewGame();
  }

  update() {
    this.listenForUIButtonPress();
    this.betNRun2Service.update();
    this.checkIfToRestartGame();
    this.keepCheckingGameViewWidth();
    this.checkIfToFollowPlayer();
    this.updateViewData();
  }
  checkIfToFollowPlayer() {
    if(this.betNRun2Service.getPlayerX() > (gameContainer.value?.clientWidth ?? 1) / 2){
      this.scrollCameraToX(this.betNRun2Service.getPlayerX() - (gameContainer.value?.clientWidth ?? 1) / 2);
    } else {
      this.scrollCameraToX(0);
    }
  }
  scrollCameraToX(targetX: number) {
    if(this.cameras.main.scrollX != targetX){
      this.cameras.main.scrollX += ((targetX - this.cameras.main.scrollX) * 0.05) * this.betNRun2Service.clockService.deltaTimeInCentiseconds;
    }
  }
  listenForUIButtonPress() {
    if(isGameButtonPress.value === true){
      this.betNRun2Service.proceedGameButton();
    }
    if(isCashOutButtonPress.value){
      this.betNRun2Service.proceedCashOut();
    }
    if(isAddStakeButtonPress.value){
      this.betNRun2Service.addStake();
    }
    if(isMinusStakeButtonPress.value){
      this.betNRun2Service.minusStake();
    }
    this.resetUIButton();
  }
  resetUIButton() {
    isGameButtonPress.value = false;
    isCashOutButtonPress.value = false;
    isAddStakeButtonPress.value = false;
    isMinusStakeButtonPress.value = false;
  }
  updateViewData() {
    gameStep.value = this.betNRun2Service.gameStep;
    playerInfo.value = this.playerService.playerInfo;
    stake.value = this.playerService.stake;
  }

  loadTextures() {
    this.load.image(AssetKeyEnum.backgroundMainHouse, ImageHelper.GetImageURL("../assets/BetNRun2/Background/mainHouse.png"));
    this.load.image(AssetKeyEnum.backgroundfirstWall, ImageHelper.GetImageURL("../assets/BetNRun2/Background/firstWall.png"));
    this.load.image(AssetKeyEnum.backgroundWall1, ImageHelper.GetImageURL("../assets/BetNRun2/Background/wall1.png"));
    this.load.image(AssetKeyEnum.backgroundWall2, ImageHelper.GetImageURL("../assets/BetNRun2/Background/wall2.png"));
    this.load.image(AssetKeyEnum.backgroundWall3, ImageHelper.GetImageURL("../assets/BetNRun2/Background/wall3.png"));
    this.load.image(AssetKeyEnum.dayBackground, ImageHelper.GetImageURL("../assets/BetNRun2/Background/dayBackground.png"));
    this.load.image(AssetKeyEnum.blankCoin, ImageHelper.GetImageURL("../assets/BetNRun2/BlankCoin.png"));
    this.loadPlayerStandingAnimationTextures();
    this.loadPlayerRunningAnimationTextures();
    this.load.image(AssetKeyEnum.crate, ImageHelper.GetImageURL("../assets/BetNRun2/crate.png"))
  }
  loadPlayerRunningAnimationTextures() {
    ImageHelper.loadPngSequenceTextures(AssetKeyEnum.runningPlayer, "../assets/BetNRun2/PngSequences/RunningBird", 50, this)
  }
  loadPlayerStandingAnimationTextures() {
    ImageHelper.loadPngSequenceTextures(AssetKeyEnum.standingPlayer, "../assets/BetNRun2/PngSequences/StandingBird", 50, this)
  }
  
  checkIfToRestartGame() {
    if (this.betNRun2Service.gameStep === GameStepEnum.proceedStartNewGame){
      this.destroyOldGame();
      this.startNewGame();
    }
  }
  startNewGame() {
    this.betNRun2Service = new BetNRun2Service(this, this.playerService);
    this.betNRun2Service.createBackground();
    this.betNRun2Service.createPlayer();
  }
  destroyOldGame() {
    this.betNRun2Service.destroyGameObjects();
    this.betNRun2Service = null;
  }
  keepCheckingGameViewWidth() {
    game?.scale.resize(gameContainer.value?.clientWidth ?? 1000, 600);
  }
  
}

let game: Phaser.Game | null = null;

onMounted(() => {
  game = new Phaser.Game({
    type: Phaser.AUTO,
    width: gameContainer.value?.clientWidth ?? 1000,
    height: 600,
    parent: "game-container",
    scene: GameScene,
  });
});

onUnmounted(() => {
  game?.destroy(true);
});
</script>

<template>
  <div>
    <div id="game-container" ref="gameContainer"></div>
    <div class="game-control-panel">
      <div class="game-control-panel-upper-section">
        <div class="bet-amount-containner">
        <div class="label">Bet amount</div>
        <div class="bet-amount game-control-component">
          <div class="bet-amount-number-section">
            <span>{{ playerInfo?.currency + " "}}</span> 
            <span>{{ stake }}</span>
          </div>
          <div class="stake-adjustment-containner">
            <div class="stake-adjustment game-sub-button" @click="PressAddStakeButton()" >+</div>
            <div class="stake-adjustment game-sub-button" @click="PressMinusStakeButton()">-</div>
          </div>
        </div>
      </div>
      <div class="difficalty-containner">
        <div class="label">Difficalty</div>
        <div class="difficalty game-control-component"></div>
      </div>
      <div class="game-button-containner">
        <div v-if="gameStep === GameStepEnum.awaitingBet" class="start-game-button game-button" @click="PressGameButton()">Start Game</div>
        <div v-else-if="gameStep === GameStepEnum.awaitingRaiseBet" class="start-game-button game-button" @click="PressGameButton()">Raise Bet</div>
        <div v-else-if="gameStep === GameStepEnum.gameOver" class="start-game-button game-button" @click="PressGameButton()">Restart Game</div>
        <div v-else class="start-game-button game-button">Raise Bet</div>
        <div v-if="gameStep === GameStepEnum.awaitingRaiseBet" class="cash-out-button game-button" @click="PressCashOutButton()">Cash Out</div>
        <div v-else class="cash-out-button game-button"></div>
      </div>
      </div>
      <div class="game-control-panel-lower-section">
        <div></div>
        <div class="balence-containner">
          <div class="label">Balence:</div>
          <div class="balence"> <span>{{ playerInfo?.currency }}</span> <span>{{ playerInfo?.balance }}</span> </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#game-container {
  width: 100%;
  height: 600px;
  margin: auto;
  background-color: aquamarine;
}
.game-control-panel{
  width: 100%;
  height: 150px;
  background-color: var(--game-controller-background-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 30px;
  border-radius: 0px 0px 10px 10px;
}
.bet-amount-containner{
  
}
.bet-amount{
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24px;
  font-weight: bold;
}
.difficalty-containner{
  
}
.difficalty{
  width: 400px;
}
.game-button-containner{
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: end;
}
.start-game-button{
  width: 400px;
}
.label{
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.game-control-panel-upper-section{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

}
.game-control-panel-lower-section{
  height: 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.balence{
  font-weight: bold;
}
.balence-containner{
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
}
.cash-out-button{
  width: 200px;
  height: 30px;
}
.stake-adjustment{
}
.stake-adjustment-containner{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  padding-right: 2px;
}
.bet-amount-number-section{
  width: 100%;
}
</style>
