export class AudioHelper{
  static GetAudioURL(path: string): string{
    let url = new URL(path, import.meta.url).href;
    return url;
  }

}