import { GameObjectBase } from "./GameObjectBase";

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
    }
}