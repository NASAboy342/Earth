export class GameObjectBase extends Phaser.GameObjects.Sprite {
    constructor (scene: Phaser.Scene, texture: Phaser.Textures.Texture) {
        super(scene, 0, 0, texture);
    }
}