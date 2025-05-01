export class ImageHelper {
    static GetRelatedHeight(desireWidth: number, originalWidth: number, originalHeight: number): number {
        let p	= desireWidth * 100 / originalWidth
        return  (p) * (originalHeight / 100)
    }
    static GetRelatedWidth(desireHeight: number, originalWidth: number, originalHeight: number): number {
        let p	= desireHeight * 100 / originalHeight
        return  (p) * (originalWidth / 100)
    }
    static GetImageURL(path: string): string {
        return new URL(path, import.meta.url).href;
    }
}