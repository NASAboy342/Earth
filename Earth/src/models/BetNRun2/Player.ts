import { AssetKeyEnum } from "../../Enums/BetNRun2/AssetKeyEnum";
import type { Background } from "./Background";
import { GameObjectBase } from "./GameObjectBase";
import { ClockService } from "../../Services/ClockService";
import { Tiles } from "./Tiles";

export class Player extends GameObjectBase {
    
    PlayerInitX: number = 120;
    PlayerInitY: number = 350;
    ScaleMultiplier: number = 0.2;
    TileSize: number = 235;
    TargetTile: Tiles;
    Speed: number = 4;
    tiles: Tiles[] = [];
    currentTileIndex = 0;
    private background: Background;
    clockService: ClockService;
    constructor (scene: Phaser.Scene, background: Background, texture: Phaser.Textures.Texture, clockService: ClockService, tiles: Tiles[]) {
        super(
            scene,
            texture
        );
        this.background = background;
        this.x = this.PlayerInitX;
        this.y = this.background.groundY;
        this.clockService = clockService;
        this.tiles = tiles;
        this.TargetTile = this.tiles[this.currentTileIndex];
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
        this.x += this.Speed * this.clockService.deltaTimeInCentiseconds;
    }
    isNotOnTargetTile(): boolean {
        return this.x < this.TargetTile.getMidTileX();
    }
    isOnTargetTile(): boolean {
        return this.x >= this.TargetTile.getMidTileX();
    }

    override create() {
        this.setOrigin(0.5, 1);
        this.setScale(this.scaleX * this.ScaleMultiplier, this.scaleY * this.ScaleMultiplier);
        this.stand();
        super.create();
    }

    moveToNextTile(tiles: number) {
        if (!this.isNotOnTargetTile()){
            this.TargetTile = this.tiles[this.currentTileIndex + tiles]
            this.currentTileIndex += tiles;
        }
    }
    getCurrentTileValue() {
      return this.tiles[this.currentTileIndex].tileValue;
    }
}