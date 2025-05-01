import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import { GameObjectBase } from "./GameObjectBase";

export class Player extends GameObjectBase {
    PlayerX: number = 0;
    PlayerY: number = 0;
    ScaleMultiplier: number = 1;
    constructor (scene: Phaser.Scene, texture: Phaser.Textures.Texture) {
        super(
            scene,
            texture
        );
        this.x = this.PlayerX;
        this.y = this.PlayerY;
    }

    override update(...args: any[]): void {
        super.update(...args);
    }

    override create() {
        this.setOrigin(0.5, 0);
        this.setScale(this.scaleX * this.ScaleMultiplier, this.scaleY * this.ScaleMultiplier);
        this.play(AssetKeyEnum.standingPlayer);
        super.create();
    }
}