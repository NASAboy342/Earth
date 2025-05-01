import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import { Background } from "../../models/BetNRun2/Background";

export class BetNRun2Service {
  private scene: Phaser.Scene;
  private background: Background;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.background = new Background(this.scene, this.scene.textures.get(AssetKeyEnum.background));
  }
  update() {
    
  }
  createBackground() {
    this.background.create();
  }
}
