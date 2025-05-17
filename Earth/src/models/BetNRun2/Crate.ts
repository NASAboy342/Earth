import { GameObjectBase } from "./GameObjectBase";

export class Crate extends GameObjectBase {

    constructor(scene: Phaser.Scene, texture: Phaser.Textures.Texture){
        super(scene, texture);
    }
}