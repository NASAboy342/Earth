import { GameObjectBase } from "./GameObjectBase";

export class Player extends GameObjectBase {
    PlayerX: number = 0;
    PlayerY: number = 0;
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
}