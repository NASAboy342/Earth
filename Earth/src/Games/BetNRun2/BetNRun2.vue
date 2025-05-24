<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import Phaser from "phaser";
import { BetNRun2Service } from "../../Services/BetNRun2/BetNRun2Service";
import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import { ImageHelper } from "../../Helpers/ImageHelper";
import { GameStepEnum } from "../../Enums/BetNRun2/GameStepEnum";

const gameContainer = ref<HTMLElement | null>(null);

class GameScene extends Phaser.Scene {
  private betNRun2Service: BetNRun2Service;

  constructor() {
    super({ key: "GameScene" });
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
  
  preload() {
    this.loadTextures();
  }
  
  create() {
    ImageHelper.createAnimationFromExistingPngSequenceTextures(AssetKeyEnum.standingPlayer, 50, this);
    ImageHelper.createAnimationFromExistingPngSequenceTextures(AssetKeyEnum.runningPlayer, 50, this, 60);

    this.startNewGame();
  }

  update() {
    this.betNRun2Service.update();
    this.checkIfToRestartGame();
    this.keepCheckingGameViewWidth();
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
  <div id="game-container" ref="gameContainer"></div>
</template>

<style scoped>
#game-container {
  width: 100%;
  height: 600px;
  margin: auto;
  background-color: aquamarine;
}
</style>
