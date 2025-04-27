<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import Phaser from "phaser";
import { ImageHelper } from "../../Helpers/ImageHelper";

// 🎮 Define Phaser GameScene
class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite; // Player sprite reference
  private playerSpeed: number = 2;

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image('BackgroundStart', new URL(`../../assets/Background.png`, import.meta.url).href)
    // ✅ Dynamically load PNG sequence (0001.png to 0050.png)
    for (let i = 1; i <= 50; i++) {
      const frameNumber = i.toString().padStart(4, "0"); // Format to "0001", "0002", ...
      this.load.image(`char_${frameNumber}`, new URL(`../../assets/PngSequences/StandingBird/${frameNumber}.png`, import.meta.url).href);
    }
  }

  create() {
    // 🎬 Create animation from individual PNGs
    const frames = [];
    for (let i = 1; i <= 50; i++) {
      const frameNumber = i.toString().padStart(4, "0");
      frames.push({ key: `char_${frameNumber}` });
    }

    this.anims.create({
      key: "birdStand",
      frames: frames,
      frameRate: 24, // Adjust speed (24 FPS is smooth)
      repeat: -1, // Loop animation
    });

    const backgroundTexture = this.textures.get("BackgroundStart");
    this.add.tileSprite(1250, 300, 0, 0,backgroundTexture).setDisplaySize(ImageHelper.GetRelatedWidth(600,backgroundTexture.getSourceImage().width, backgroundTexture.getSourceImage().height), 600); // Tiling background

    // 🏃‍♂️ Add player and play animation
    this.player = this.add.sprite(100, 445, "char_0001").setDisplaySize(230, 230).play("birdStand");
  }

  update() {
    // Move player to the right at the given speed
    this.player.x += this.playerSpeed;

    // If the player goes off the screen, reset its position
    if (this.player.x > 800) {
      this.player.x = 0;
    }
  }
}



let game: Phaser.Game | null = null;

onMounted(() => {
  game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    parent: "game-container", // Attach Phaser to div
    scene: GameScene,
  });
});

onUnmounted(() => {
  game?.destroy(true); // Cleanup
});

</script>

<template>
  <div id="game-container"></div>
  <!-- <img src="../../assets/PngSequences/StandingBird/0001.png" alt=""> -->
</template>

<style scoped>
#game-container {
  width: 1000px;
  height: 600px;
  margin: auto;
}
</style>
