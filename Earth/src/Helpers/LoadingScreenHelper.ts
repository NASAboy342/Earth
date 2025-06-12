export class LoadingScreenHelper {
  static create(scene: Phaser.Scene): void {
    // Create a simple loading bar
    const width = scene.cameras.main.width;
    const height = scene.cameras.main.height;

    const progressBox = scene.add.graphics();
    const progressBar = scene.add.graphics();

    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 4, height / 2 - 20, width / 2, 40);

    const loadingText = scene.add
      .text(width / 2, height / 2 - 50, "Loading...", {
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    scene.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        width / 4 + 10,
        height / 2 - 10,
        (width / 2 - 20) * value,
        20
      );
    });

    scene.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      //this.scene.start('MainScene'); // go to your main game
    });
  }
}
