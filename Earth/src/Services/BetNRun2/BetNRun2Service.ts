import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import { ImageHelper } from "../../Helpers/ImageHelper";
import { Background } from "../../models/BetNRun2/Background";
import { Player } from "../../models/BetNRun2/Player";

export class BetNRun2Service {
  private scene: Phaser.Scene;
  private background: Background;
  private player: Player;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.background = new Background(this.scene, this.scene.textures.get(AssetKeyEnum.background));
    this.player = new Player(this.scene, this.scene.textures.get(ImageHelper.getFirstFrameOfPngSequenceTextures(AssetKeyEnum.standingPlayer)));
  }
  update() {
    
  }
  createBackground() {
    //this.background.create();
  }

  createPlayer() {
    this.player.create();
  }
}
