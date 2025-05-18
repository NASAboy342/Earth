import type { Background } from "./Background";
import { GameObjectBase } from "./GameObjectBase";

export class Crate extends GameObjectBase {

    private background: Background;
    crateId: string;
    scaleMultiplier: number = 0.3;
    fallSpeed: number = 0;

    constructor(scene: Phaser.Scene, background: Background, crateId: string, texture: Phaser.Textures.Texture){
        super(scene, texture);
        this.background = background;
        this.crateId = crateId;
    }

    override update(...args: any[]): void {
        this.fallIfNotOnGround();
    }

    override create(): void {
        this.setOrigin(0.5, 1);
        this.setScale(this.scaleX * this.scaleMultiplier, this.scaleY * this.scaleMultiplier);
        super.create();
    }
    fallIfNotOnGround() {
        if(!this.isOnGround()){
            this.y += this.fallSpeed;
            this.fallSpeed += 0.1;
        }
        else{
            this.y = this.background.groundY;
            this.fallSpeed = 0;
        }
    }
    isOnGround() {
        return this.y >= this.background.groundY
    }
}

export enum CrateTypeEnum {
    spawnOnPlayer = "spawnOnPlayer",
    randomSpawn = "randomSpawn",
}