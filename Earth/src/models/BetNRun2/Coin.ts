import { GameObjectBase } from "./GameObjectBase";

export class Coin extends GameObjectBase{

    scaleMultiplier: number = 0.80;
    coinValue: number = 0;
    displayNumber: Phaser.GameObjects.Text;
    constructor(scene: Phaser.Scene, texture: Phaser.Textures.Texture, x: number, y: number, coinValue: number = 0){
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
        super.destroy(fromScene);
    }
}