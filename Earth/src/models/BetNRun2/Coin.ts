import type { ClockService } from "../../Services/ClockService";
import { GameObjectBase } from "./GameObjectBase";

export class Coin extends GameObjectBase{

    scaleMultiplier: number = 0.80;
    coinValue: number = 0;
    displayNumber: Phaser.GameObjects.Text;
    coinPreviousStatus: CoinStatusEnum = CoinStatusEnum.idle;
    coinStatus: CoinStatusEnum = CoinStatusEnum.idle;
    clockService: ClockService;
    constructor(scene: Phaser.Scene, texture: Phaser.Textures.Texture, x: number, y: number, coinValue: number = 0, clockService: ClockService){
        super(scene, texture);
        this.x = x;
        this.y = y;
        this.coinValue = coinValue;
        this.displayNumber = new Phaser.GameObjects.Text(scene, this.x, this.y, 'X'+coinValue.toString(), {
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#ffffff',
            fontFamily: 'Arial',
            align: 'center'
        })
        this.clockService = clockService;
    }

    override update(): void {
        this.playAnumation();
    }
    playAnumation() {
        this.playCoinCollected();
    }
    playCoinCollected() {
        if(this.coinStatus === CoinStatusEnum.collected){
            this.alpha -= 0.01 * this.clockService.deltaTimeInCentiseconds;
            if(this.alpha <= 0.01){
                this.setNewCoinStatus(CoinStatusEnum.destroyed)
            }
        }
    }

    override create(): void {
        this.setOrigin(0.5, 0.5);
        this.setScale(this.scaleMultiplier, this.scaleMultiplier);
        super.create();
        this.displayNumber.setOrigin(0.5, 0.5);
        this.scene.add.existing(this.displayNumber);
    }

    override destroy(fromScene?: boolean): void {
        this.displayNumber.destroy();
        this.displayNumber = null;
        super.destroy(fromScene);
    }
    setNewCoinStatus(newCoinstatus: CoinStatusEnum) {
        if(this.coinStatus !== newCoinstatus){
            this.coinPreviousStatus = this.coinStatus;
            this.coinStatus = newCoinstatus
        }
    }
}

export enum CoinStatusEnum{
    idle,
    collected,
    destroyed,
}