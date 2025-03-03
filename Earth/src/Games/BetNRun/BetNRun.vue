<script setup lang="ts">
import { onMounted } from "vue";
import Phaser from "phaser";

onMounted(() => {
  class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private cars!: Phaser.Physics.Arcade.Group;
    private speed: number = 200;

    constructor() {
      super({ key: "GameScene" });
    }

    preload() {
      this.load.image("chicken", "https://labs.phaser.io/assets/sprites/chicken.png");
      this.load.image("car", "https://labs.phaser.io/assets/sprites/car-red.png");
      this.load.image("road", "https://labs.phaser.io/assets/sprites/road.png");
    }

    create() {
      // Background
      this.add.image(400, 300, "road").setDisplaySize(800, 600);

      // Player (Chicken)
      this.player = this.physics.add.sprite(400, 550, "chicken").setScale(0.5);
      this.player.setCollideWorldBounds(true);

      // Cars (Obstacles)
      this.cars = this.physics.add.group();
      this.spawnCar();

      // Input Handling
      this.cursors = this.input.keyboard!.createCursorKeys();

      // Collision Detection
      this.physics.add.collider(this.player, this.cars, this.handleCollision, undefined, this);
    }

    update() {
      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-this.speed);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(this.speed);
      } else {
        this.player.setVelocityY(0);
      }

      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-this.speed);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(this.speed);
      } else {
        this.player.setVelocityX(0);
      }
    }

    spawnCar() {
      const xPositions = [200, 400, 600];
      const lane = Phaser.Math.RND.pick(xPositions);
      const car = this.cars.create(lane, 0, "car").setScale(0.5);
      car.setVelocityY(150);
      car.setCollideWorldBounds(false);

      this.time.delayedCall(1000, () => this.spawnCar());
    }

    handleCollision() {
      this.physics.pause();
      this.player.setTint(0xff0000);
      console.log("Game Over!");
    }
  }

  const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    physics: {
      default: "arcade",
      arcade: { debug: false },
    },
    scene: [GameScene],
  };

  new Phaser.Game(gameConfig);
});
</script>

<template>
  <div id="game-container"></div>
</template>

<style scoped>
#game-container {
  width: 800px;
  height: 600px;
  margin: auto;
}
</style>
