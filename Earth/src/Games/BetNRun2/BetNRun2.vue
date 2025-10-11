<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import mainHouseImg from '../../assets/BetNRun2/Background/mainHouse.png';
import firstWallImg from '../../assets/BetNRun2/Background/firstWall.png';
import wall1Img from '../../assets/BetNRun2/Background/wall1.png';
import wall2Img from '../../assets/BetNRun2/Background/wall2.png';
import wall3Img from '../../assets/BetNRun2/Background/wall3.png';
import dayBackgroundImg from '../../assets/BetNRun2/Background/dayBackground.png';
import blankCoinImg from '../../assets/BetNRun2/BlankCoin.png';
import crateImg from '../../assets/BetNRun2/crate.png';
import backgroundMusicAudio from '../../assets/BetNRun2/sound/JoyfulStakes (online-audio-converter.com).ogg';
const runningBirdImages = import.meta.glob('../../assets/BetNRun2/PngSequences/RunningBird/*.png', { eager: true });
const standingBirdImages = import.meta.glob('../../assets/BetNRun2/PngSequences/StandingBird/*.png', { eager: true });
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
const isMobileScreen = ref<boolean>(window.innerWidth < 768);
const gameBetButton = ref<string>(isMobileScreen.value ? "start-game-button-for-mobile game-button-for-mobile" : "start-game-button game-button");
const cashOutButton = ref<string>(isMobileScreen.value ? "cash-out-button-for-mobile game-button-for-mobile" : "cash-out-button game-button");
const gameContainerStyle = ref<string>(isMobileScreen.value ? "game-container-for-mobile" : "game-container");
const gameButtonContainner = ref<string>(isMobileScreen.value ? "game-button-containner-for-mobile" : "game-button-containner");
const cashOutAmount = ref<number>(0);

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
    this.loadSound();
    this.load.audio(AssetKeyEnum.backgroundMusic, backgroundMusicAudio);
    
  }
  
  create() {
    ImageHelper.createAnimationFromExistingPngSequenceTextures(AssetKeyEnum.standingPlayer, 50, this);
    ImageHelper.createAnimationFromExistingPngSequenceTextures(AssetKeyEnum.runningPlayer, 50, this, 60);
    this.playerService = new PlayerService();
    this.playerService.InitPlayerInfo("DemoPlayer");
    this.startNewGame();
    if(isMobileScreen.value){
      this.cameras.main.zoom = 0.7;
    }
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
    let midScreenX = ((gameContainer.value?.clientWidth ?? 1) / 2) - (isMobileScreen.value ? 200 : 0);
    if(this.betNRun2Service.getPlayerX() > midScreenX){
      this.scrollCameraToX(this.betNRun2Service.getPlayerX() - midScreenX);
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
    cashOutAmount.value = this.betNRun2Service.cashOutAmounts;
  }

  loadTextures() {
    this.load.image(AssetKeyEnum.backgroundMainHouse, mainHouseImg);
    this.load.image(AssetKeyEnum.backgroundfirstWall, firstWallImg);
    this.load.image(AssetKeyEnum.backgroundWall1, wall1Img);
    this.load.image(AssetKeyEnum.backgroundWall2, wall2Img);
    this.load.image(AssetKeyEnum.backgroundWall3, wall3Img);
    this.load.image(AssetKeyEnum.dayBackground, dayBackgroundImg);
    this.load.image(AssetKeyEnum.blankCoin, blankCoinImg);
    this.loadPlayerStandingAnimationTextures();
    this.loadPlayerRunningAnimationTextures();
    this.load.image(AssetKeyEnum.crate, crateImg);
  }
  loadSound() {
    
  }
  loadPlayerRunningAnimationTextures() {
    // Load running bird animation frames using imported images
    Object.entries(runningBirdImages).forEach(([path, module]) => {
      const fileName = path.split('/').pop()?.replace('.png', '');
      if (fileName) {
        this.load.image(`${AssetKeyEnum.runningPlayer}_${fileName}`, (module as any).default);
      }
    });
  }
  loadPlayerStandingAnimationTextures() {
    // Load standing bird animation frames using imported images
    Object.entries(standingBirdImages).forEach(([path, module]) => {
      const fileName = path.split('/').pop()?.replace('.png', '');
      if (fileName) {
        this.load.image(`${AssetKeyEnum.standingPlayer}_${fileName}`, (module as any).default);
      }
    });
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
    audio: {
      disableWebAudio: false
    }
  });
});

onUnmounted(() => {
  game?.destroy(true);
});
</script>

<template>
  <div>
    <div id="game-container" :class="gameContainerStyle" ref="gameContainer"></div>
    <div :class="isMobileScreen ? 'game-control-panel-for-mobile' : 'game-control-panel'">
      <div class="game-control-panel-upper-section">
        <div class="bet-amount-containner">
        <div class="label">Bet amount</div>
        <div :class="isMobileScreen ? 'bet-amount-for-mobile game-control-component-for-mobile' : 'bet-amount game-control-component'">
          <div class="bet-amount-number-section">
            <span>{{ playerInfo?.currency + " "}}</span> 
            <span>{{ stake }}</span>
          </div>
          <div class="stake-adjustment-containner">
            <div :class="isMobileScreen ? 'stake-adjustment game-sub-button-for-mobile' : 'stake-adjustment game-sub-button'" @click="PressAddStakeButton()" >+</div>
            <div :class="isMobileScreen ? 'stake-adjustment game-sub-button-for-mobile' : 'stake-adjustment game-sub-button'" @click="PressMinusStakeButton()">-</div>
          </div>
        </div>
      </div>
      <!-- <div class="difficalty-containner">
        <div class="label">Difficalty</div>
        <div class="difficalty game-control-component"></div>
      </div> -->
      <div :class="gameButtonContainner">
        <div v-if="gameStep === GameStepEnum.awaitingBet" :class="gameBetButton" @click="PressGameButton()">Start Game</div>
        <div v-else-if="gameStep === GameStepEnum.awaitingRaiseBet" :class="gameBetButton" @click="PressGameButton()">Raise Bet</div>
        <div v-else-if="gameStep === GameStepEnum.gameOver" :class="gameBetButton" @click="PressGameButton()">Restart Game</div>
        <div v-else :class="gameBetButton">Raise Bet</div>
        <div v-if="gameStep === GameStepEnum.awaitingRaiseBet" :class="cashOutButton" @click="PressCashOutButton()">{{ cashOutAmount }} Cash Out</div>
        <div v-else :class="cashOutButton"></div>
      </div>
      </div>
      <div class="game-control-panel-lower-section">
        <div></div>
        <div class="balence-containner">
          <div class="label">Balence:</div>
          <div class="balence"> <span>{{ playerInfo?.currency }}</span> <span>{{ Phaser.Math.RoundTo(playerInfo?.balance ?? 0, -2) }}</span> </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  width: 100%;
  height: 600px;
  margin: auto;
  background-color: aquamarine;
}
.game-container-for-mobile {
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
.game-control-panel-for-mobile{
  width: 100%;
  height: 150px;
  background-color: var(--game-controller-background-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 10px;
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
.bet-amount-for-mobile{
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
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
.game-button-containner-for-mobile{
  @apply game-button-containner;
  gap: 20px;
}
.start-game-button{
  width: 400px;
}
.start-game-button-for-mobile{
  width: 200px;
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
.cash-out-button-for-mobile{
  @apply cash-out-button;
  width: 200px;
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
