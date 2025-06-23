import { Scene } from "phaser";
import { GameObjectBase } from "./GameObjectBase";
import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import { AudioHelper } from "../../Helpers/AudioHelper";

export class Background extends GameObjectBase {
    BackgroundX: number = 0;
    BackgroundY: number = 0;
    SclaleMultiplier = 0.85;
    groundY: number = 567;
    constructor (scene: Phaser.Scene, texture: Phaser.Textures.Texture) {
        super(
            scene,
            texture
        );
        this.x = this.BackgroundX;
        this.y = this.BackgroundY;
        
    }

    override create() {
        this.setOrigin(0, 0);
        this.setScale(this.scaleX * this.SclaleMultiplier, this.scaleY * this.SclaleMultiplier);
        super.create();
        this.scene.sound.add(AssetKeyEnum.backgroundMusic);
    }

    playBackgroundMusic(){
        AudioHelper.PlaySoundIfNotPlaying(this.scene, AssetKeyEnum.backgroundMusic, {
            loop: true,
            delay: 2
        });
    }
}