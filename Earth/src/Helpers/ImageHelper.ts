import type { AssetKeyEnum } from "../Enums/BetNRun2/AssetKeyEnum";

export class ImageHelper {
  static createAnimationFromPngSequenceTextures(
    key: AssetKeyEnum,
    folderPath: string,
    frames: number,
    scene: Phaser.Scene,
    framesPerSenond: number = 24
  ) {
    this.loadPngSequenceTextures(key, folderPath, frames, scene);
    this.createAnimationFromExistingPngSequenceTextures(
      key,
      frames,
      scene,
      framesPerSenond
    );
  }
  static createAnimationFromExistingPngSequenceTextures(
    key: AssetKeyEnum,
    frames: number,
    scene: Phaser.Scene,
    framesPerSenond: number = 24
  ) {
    let framesKey = this.getFrameKeys(key, frames, scene);

    scene.anims.create({
      key: key,
      frames: framesKey,
      frameRate: framesPerSenond, // Adjust speed (24 FPS is smooth)
      repeat: -1, // Loop animation
    });
  }
  static getFrameKeys(key: AssetKeyEnum, frames: number, scene: Phaser.Scene): any[] {
    let framesKey = [];
    for (let i = 1; i <= frames; i++) {
      const frameNumber = this.getFrameNumber(i);
      framesKey.push({key:`${key}_${frameNumber}`});
    }
    return framesKey;
  }
  static getFrameNumber(i: number): string {
    return i.toString().padStart(4, "0"); // Format to "0001", "0002", ...
  }
  static loadPngSequenceTextures(
    key: AssetKeyEnum,
    folderPath: string,
    frames: number,
    scene: Phaser.Scene
  ) {
    for (let i = 1; i <= frames; i++) {
      const frameNumber = this.getFrameNumber(i);
      scene.load.image(
        `${key}_${frameNumber}`,
        this.GetImageURL(`${folderPath}/${frameNumber}.png`)
      );
    }
  }
  static getFirstFrameOfPngSequenceTextures(key: AssetKeyEnum) {
    return `${key}_0001`;
  }
  static GetRelatedHeight(
    desireWidth: number,
    originalWidth: number,
    originalHeight: number
  ): number {
    let p = (desireWidth * 100) / originalWidth;
    return p * (originalHeight / 100);
  }
  static GetRelatedWidth(
    desireHeight: number,
    originalWidth: number,
    originalHeight: number
  ): number {
    let p = (desireHeight * 100) / originalHeight;
    return p * (originalWidth / 100);
  }
  static GetImageURL(path: string): string {
    return new URL(path, import.meta.url).href;
  }
}
