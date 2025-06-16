export class LoadingScreenHelper {
  static create(scene: Phaser.Scene): void {
    const sceneWidth = scene.cameras.main.width;
    const sceneHeight = scene.cameras.main.height;
    

    const progressBox = new ProgressBox(scene, sceneWidth / 4, sceneHeight / 2 - 20, sceneWidth / 2, 40);
    const loadingText = new LoadingText(scene, sceneWidth / 2, sceneHeight / 2 - 50);

    scene.load.on("progress", (value: number) => {
        progressBox.progressBar.draw(value);
    });

    scene.load.on("complete", () => {
      progressBox.destroy();
      loadingText.destroy();
    });
  }
}

class ProgressBox extends Phaser.GameObjects.Graphics {
    progressBar: ProgressBar;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene);
        this.x = x;
        this.y = y;
        this.draw(width, height);
        this.addToDisplayList();
        this.progressBar = new ProgressBar(scene, x, y, width, height);
    }
    draw(width: number, height: number) {
        this.fillStyle(0x222222, 1);
        this.fillRect(0, 0, width, height);
        this.fillCircle(0, 0 + (height / 2), (height / 2));
        this.fillCircle(width, (height / 2), (height / 2));
    }

    override destroy(fromScene?: boolean): void {
        this.progressBar.destroy(fromScene);
        super.destroy(fromScene);
    }
}

class ProgressBar extends Phaser.GameObjects.Graphics {
    progressBoxWidth: number;
    progressBoxHeight: number;
    padding = 10;
    constructor(scene: Phaser.Scene, x: number, y: number, progressBoxwidth: number, progressBoxHeight: number) {
        super(scene);
        this.x = x + (this.padding / 2);
        this.y = y + (this.padding / 2);
        this.progressBoxWidth = progressBoxwidth;
        this.progressBoxHeight = progressBoxHeight;
        this.addToDisplayList();
    }

    draw(value: number) {
        let width = ((this.progressBoxWidth - (this.padding)) * value) ;
        let height = this.progressBoxHeight - (this.padding);
        this.clear();
        this.fillStyle(0xffffff, 1);
        this.fillRect(0, 0, width , height);
        this.fillCircle(0, 0 + (height / 2), (height / 2));
        this.fillCircle(width, (height / 2), (height / 2));
    }
}

class LoadingText extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'Loading...', {
        fontSize: "20px",
        color: "#ffffff",
        });
        this.setOrigin(0.5);
        this.addToDisplayList();
    }
}
