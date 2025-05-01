export class GameObjectBase extends Phaser.GameObjects.Sprite {
    constructor (scene: Phaser.Scene, texture: Phaser.Textures.Texture) {
        super(scene, 0, 0, texture);
        this.scene = scene;
    }
    create(){
        this.scene.add.existing(this);
    }
}