// angular-electron/src/app/interfaces/iimage.interface.ts

// import { ElementRef } from '@angular/core';

export interface ICreateImageOptions {
	bytesPerPixel?: number;
	bytesPerLine?: number;
	colourModel?: string;
}

// JavaScript's ImageData interface:
// interface ImageData {
// 	readonly width: number; // unsigned long
// 	readonly height: number; // unsigned long
// 	readonly data: Uint8ClampedArray; // Pixel data is in the order RGBA
// }

// JavaScript's ImageBitmap interface:
// interface ImageBitmap {
// 	readonly width: number; // unsigned long
// 	readonly height: number; // unsigned long
//
// close();
// }

// void context.drawImage(image, dx, dy);
// void context.drawImage(image, dx, dy, dWidth, dHeight);
// void context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

// ImageData context.createImageData(width, height);
// ImageData context.createImageData(imageData);

// context.getImageData(...);

// context.putImageData(...);

// IImage extends ImageData :
// so every IImage is-a ImageData
// and every Image object is-a ImageData
// so an Image or IImage can be passed as a parameter
// to a JavaScript / Node.js function that takes a parameter of type ImageData

export interface IImage {
	readonly width: number;
	readonly height: number;
	readonly data: Uint8ClampedArray;
	readonly bytesPerPixel: number;
	readonly bytesPerLine: number;

	copyFromArray(
		arrayImageWidth: number,
		arrayImageHeight: number,
		arrayImageData: Uint8ClampedArray
	): void;
}

// export interface IOffscreenImage extends IImage {
// }
export type IOffscreenImage = IImage;

export interface ICanvasImage extends IImage {
	asImageData(): ImageData;
	asImageBitmap(): Promise<ImageBitmap>;

	drawOnCanvas(dx: number, dy: number): Promise<void>;
}
