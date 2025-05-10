export class GameObjectBase extends Phaser.GameObjects.Sprite {
    constructor (scene: Phaser.Scene, texture: Phaser.Textures.Texture) {
        super(scene, 0, 0, texture);
        this.scene = scene;
    }
    create(){
        this.scene.add.existing(this);
    }

    override play(key: string | Phaser.Animations.Animation | Phaser.Types.Animations.PlayAnimationConfig, ignoreIfPlaying?: boolean): this {
        if (this.anims.getName() !== key) {
            return super.play(key);
        }
        return this;
    }
}