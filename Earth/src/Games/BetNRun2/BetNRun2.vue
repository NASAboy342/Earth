<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import Phaser from "phaser";
import { BetNRun2Service } from "../../Services/BetNRun2/BetNRun2Service";
import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import { ImageHelper } from "../../Helpers/ImageHelper";
import { GameStepEnum } from "../../Enums/BetNRun2/GameStepEnum";

const gameContainer = ref<HTMLElement | null>(null);
const gameStep = ref<GameStepEnum>();
const isGameButtonPress = ref<boolean>(false);

const PressGameButton = () => {
  isGameButtonPress.value = true;
}

class GameScene extends Phaser.Scene {
  private betNRun2Service: BetNRun2Service;

  constructor() {
    super({ key: "GameScene" });
  }
  
  preload() {
    this.loadTextures();
  }
  
  create() {
    ImageHelper.createAnimationFromExistingPngSequenceTextures(AssetKeyEnum.standingPlayer, 50, this);
    ImageHelper.createAnimationFromExistingPngSequenceTextures(AssetKeyEnum.runningPlayer, 50, this, 60);

    this.startNewGame();
  }

  update() {
    this.listenForUIButtonPress();
    this.betNRun2Service.update();
    this.checkIfToRestartGame();
    this.keepCheckingGameViewWidth();
    this.updateViewData();
  }
  listenForUIButtonPress() {
    if(isGameButtonPress.value === true){
      this.betNRun2Service.proceedGameButton();
      this.resetUIButton();
    }
    
  }
  resetUIButton() {
    isGameButtonPress.value = false;
  }
  updateViewData() {
    gameStep.value = this.betNRun2Service.gameStep;
  }

  loadTextures() {
    this.load.image(AssetKeyEnum.background, ImageHelper.GetImageURL("../assets/BetNRun2/Background.png"));
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
    this.betNRun2Service = new BetNRun2Service(this);
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
          <span>$</span> 
          <span>0</span>
        </div>
      </div>
      <div class="difficalty-containner">
        <div class="label">Difficalty</div>
        <div class="difficalty game-control-component"></div>
      </div>
      <div class="game-button-containner">
        <div class="label"></div>
        <div v-if="gameStep === GameStepEnum.awaitingBet" class="start-game-button game-button" @click="PressGameButton()">Start Game</div>
        <div v-else-if="gameStep === GameStepEnum.awaitingRaiseBet" class="start-game-button game-button" @click="PressGameButton()">Raise Bet</div>
        <div v-else-if="gameStep === GameStepEnum.gameOver" class="start-game-button game-button" @click="PressGameButton()">Restart Game</div>
        <div v-else class="start-game-button game-button">Raise Bet</div>
      </div>
      </div>
      <div class="game-control-panel-lower-section">
        <div></div>
        <div class="balence-containner">
          <div class="label">Balence:</div>
          <div class="balence"> <span>$</span> <span>1000</span> </div>
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
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}
.difficalty-containner{
  
}
.difficalty{
  width: 400px;
}
.game-button-containner{

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
</style>
