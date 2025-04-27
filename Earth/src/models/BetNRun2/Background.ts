import { GameObjectBase } from "./GameObjectBase";

export class Background extends GameObjectBase {
    BackgroundX: number = 0;
    BackgroundY: number = 0;
    constructor (scene: Phaser.Scene, texture: Phaser.Textures.Texture) {
        super(
            scene,
            texture
        );
        this.x = this.BackgroundX;
        this.y = this.BackgroundY;
    }
}