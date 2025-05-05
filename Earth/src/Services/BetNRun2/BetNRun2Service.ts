import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import { ImageHelper } from "../../Helpers/ImageHelper";
import { Background } from "../../models/BetNRun2/Background";
import { Player } from "../../models/BetNRun2/Player";

export class BetNRun2Service {
  private scene: Phaser.Scene;
  private background: Background;
  private player: Player;
  spaceKey: Phaser.Input.Keyboard.Key;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.background = new Background(this.scene, this.scene.textures.get(AssetKeyEnum.background));
    this.player = new Player(this.scene, this.scene.textures.get(ImageHelper.getFirstFrameOfPngSequenceTextures(AssetKeyEnum.standingPlayer)));
    
    this.spaceKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }
  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      console.log("Space key pressed!");
      this.movePlayerToNextPosition();
    }
    this.player.update();
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
