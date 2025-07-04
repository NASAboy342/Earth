export class AudioHelper {
  static GetAudioURL(path: string): string {
    let url = new URL(path, import.meta.url).href;
    return url;
  }
  static PlaySoundIfNotPlaying(scene: Phaser.Scene, key: string, config: Phaser.Types.Sound.SoundConfig ) {
    if (!scene.sound.isPlaying(key)) {
      scene.sound.play(key, config);
    }
  }
}
