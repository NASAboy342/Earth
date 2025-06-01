import { GameObjectBase } from "./GameObjectBase";

export class Tiles extends GameObjectBase{
    
    width: number = 279;
    height: number = 716;
    scaleMultiplier: number = 0.85;
    midTileWidth: number = (this.width / 2) * this.scaleMultiplier;
    tileValue: number = 0;

    constructor(scene: Phaser.Scene, texture: Phaser.Textures.Texture, x: number, y: number){
        super(scene, texture);
        this.x = x;
        this.y = y;
    }

    getTileWidth(): number {
        return this.width * this.scaleMultiplier;
    }

    override create() {
        this.setOrigin(0, 1);
        this.setScale(this.scaleMultiplier, this.scaleMultiplier);
        super.create();
    }

    getMidTileX() {
        return this.x + this.midTileWidth;
    }
}