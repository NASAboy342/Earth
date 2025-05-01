<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import Phaser from "phaser";
import { BetNRun2Service } from "../../Services/BetNRun2/BetNRun2Service";
import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import { ImageHelper } from "../../Helpers/ImageHelper";

class GameScene extends Phaser.Scene {
  private betNRun2Service: BetNRun2Service;

  constructor() {
    super({ key: "GameScene" });
  }
  
  loadTextures() {
    this.load.image(AssetKeyEnum.background, ImageHelper.GetImageURL("../assets/BetNRun2/Background.png"));
  }
  
  preload() {
    this.loadTextures();
  }
  
  create() {
    this.betNRun2Service = new BetNRun2Service(this);
    this.betNRun2Service.createBackground();
  }

  update() {
    this.betNRun2Service.update();
  }
}

let game: Phaser.Game | null = null;

onMounted(() => {
  game = new Phaser.Game({
    type: Phaser.AUTO,
    width: window.innerWidth * 0.8,
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
  <div id="game-container"></div>
</template>

<style scoped>
#game-container {
  width: 100%;
  height: 600px;
  margin: auto;
}
</style>
