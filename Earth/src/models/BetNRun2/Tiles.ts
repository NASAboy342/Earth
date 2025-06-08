import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import { Coin } from "./Coin";
import { GameObjectBase } from "./GameObjectBase";

export class Tiles extends GameObjectBase{
    
    width: number = 279;
    height: number = 716;
    scaleMultiplier: number = 0.85;
    midTileWidth: number = (this.width / 2) * this.scaleMultiplier;
    tileValue: number = 0;
    coin: Coin;
    isMainTile: boolean;

    constructor(scene: Phaser.Scene, texture: Phaser.Textures.Texture, x: number, y: number, isMainTile: boolean = false, tileValue: number = 0) {
        super(scene, texture);
        this.x = x;
        this.y = y;
        this.isMainTile = isMainTile;
        if(!isMainTile){
            this.coin = new Coin(scene, scene.textures.get(AssetKeyEnum.blankCoin), (this.x + this.midTileWidth), (this.height / 3), tileValue);
        }
        this.tileValue = tileValue;
    }

    getTileWidth(): number {
        return this.width * this.scaleMultiplier;
    }

    override create() {
        this.setOrigin(0, 1);
        this.setScale(this.scaleMultiplier, this.scaleMultiplier);
        super.create();
        if(!this.isMainTile){
            this.coin.create();
        }
    }

    getMidTileX() {
        return this.x + this.midTileWidth;
    }

    override destroy(fromScene?: boolean): void {
        if(this.coin) {
            this.coin.destroy(fromScene);
        }
        super.destroy(fromScene);
    }
}