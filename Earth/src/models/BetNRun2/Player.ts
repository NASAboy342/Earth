import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import { GameObjectBase } from "./GameObjectBase";

export class Player extends GameObjectBase {
    PlayerInitX: number = 120;
    PlayerInitY: number = 350;
    ScaleMultiplier: number = 0.2;
    TileSize: number = 235;
    TargetTile: number = this.PlayerInitX;
    Speed: number = 3;
    constructor (scene: Phaser.Scene, texture: Phaser.Textures.Texture) {
        super(
            scene,
            texture
        );
        this.x = this.PlayerInitX;
        this.y = this.PlayerInitY;
    }

    override update(...args: any[]): void {
        this.moveIfNotOnTargetTile();
        super.update(...args);
    }
    moveIfNotOnTargetTile() {
        if (this.isNotOnTargetTile()){
            this.run();
        }
        else{
            this.stand();
        }
    }
    stand() {
        this.play(AssetKeyEnum.standingPlayer);
    }
    run() {
        this.play(AssetKeyEnum.runningPlayer);
        this.x += this.Speed;
    }
    isNotOnTargetTile(): boolean {
        return this.x < this.TargetTile;
    }

    override create() {
        this.setOrigin(0.5, 0);
        this.setScale(this.scaleX * this.ScaleMultiplier, this.scaleY * this.ScaleMultiplier);
        this.stand();
        super.create();
    }

    moveToNextTile(tiles: number) {
        if (!this.isNotOnTargetTile()){
            this.TargetTile = this.x + (this.TileSize + tiles);
        }
    }
}