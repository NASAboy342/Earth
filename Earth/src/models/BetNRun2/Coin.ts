import { GameObjectBase } from "./GameObjectBase";

export class Coin extends GameObjectBase{

    scaleMultiplier: number = 0.80;
    constructor(scene: Phaser.Scene, texture: Phaser.Textures.Texture, x: number, y: number){
        super(scene, texture);
        this.x = x;
        this.y = y;
    }

    override create(): void {
        this.setOrigin(0.5, 0.5);
        this.setScale(this.scaleMultiplier, this.scaleMultiplier);
        super.create();
    }
}