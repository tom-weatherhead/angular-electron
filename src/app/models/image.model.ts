// angular-electron/src/app/models/image.model.ts

// This file is the sole reason why this rule is in tslint.json :
//
// "max-classes-per-file": [
// 	true,
// 	3
// ],
//
// We would prefer to replace it with:
//
// "max-classes-per-file": false,

import { ElementRef } from '@angular/core';

// import {
// 	getTypeString
// } from 'thaw-common-utilities.ts';

// import { createThAWImage, IThAWImage } from 'thaw-image-processing.ts';
import { defaultBytesPerPixel } from 'thaw-image-processing.ts';

import {
	ICanvasImage,
	ICreateImageOptions,
	IImage // ,
	// IOffscreenImage
} from '../interfaces/iimage.interface';

// const defaultBytesPerPixel = 4;

// In JavaScript's ImageData interface,
// pixel data is always in the order RGBA.
// const defaultColourModel = 'RGBA';

abstract class ImageBase implements IImage {
	public readonly width: number;
	public readonly height: number;
	public readonly data: Uint8ClampedArray;
	public readonly bytesPerPixel: number;
	public readonly bytesPerLine: number;
	// public readonly colourModel: string;

	// Multiple constructor implementations are not allowed.

	constructor(
		width: number,
		height: number,
		data?: Uint8ClampedArray,
		options?: ICreateImageOptions
	) {
		if (!width || !height) {
			throw new Error('Image constructor: Falsy width or height.');
		}

		if (!data) {
			throw new Error('Image constructor: Falsy data.');
		}

		options = options || {};

		this.width = width;
		this.height = height;
		this.data = data;

		this.bytesPerPixel = options.bytesPerPixel || defaultBytesPerPixel;
		// Q: Should we 4-byte-align or 8-byte-align any image data that we allocate?
		this.bytesPerLine =
			options.bytesPerLine || this.bytesPerPixel * this.width;
		// this.colourModel = options.colourModel || defaultColourModel;
		// this. = ;
	}

	public abstract copyFromArray(
		arrayImageWidth: number,
		arrayImageHeight: number,
		arrayImageData: Uint8ClampedArray
	): void;
}

// TODO? :
// class OffscreenImage extends ThAWImage implements IOffscreenImage {
// 	...
// }

// class OffscreenImage extends ImageBase implements IOffscreenImage {
// 	constructor(
// 		width: number,
// 		height: number,
// 		data?: Uint8ClampedArray,
// 		options?: ICreateImageOptions
// 	) {
// 		// TODO: If data is undefined then allocate a Uint8ClampedArray
// 		// of the appropriate size

// 		super(width, height, data, options);
// 	}

// 	public copyFromArray(
// 		arrayImageWidth: number,
// 		arrayImageHeight: number,
// 		arrayImageData: Uint8ClampedArray
// 	): void {
// 		console.error('OffscreenImage.copyFromArray() : Not implemented');
// 		console.error(
// 			'OffscreenImage.copyFromArray() : arrayImageWidth is',
// 			arrayImageWidth
// 		);
// 		console.error(
// 			'OffscreenImage.copyFromArray() : arrayImageHeight is',
// 			arrayImageHeight
// 		);
// 		console.error(
// 			'OffscreenImage.copyFromArray() : arrayImageData is',
// 			arrayImageData
// 		);
// 	}

// 	public copyFromImage(
// 		srcImage: IImage,
// 		srcLeft: number,
// 		srcTop: number,
// 		dstLeft: number,
// 		dstTop: number,
// 		width: number,
// 		height: number
// 	): void {
// 		console.error('OffscreenImage.copyFromImage() : Not implemented');
// 		console.error(
// 			'OffscreenImage.copyFromImage() : srcImage is',
// 			srcImage
// 		);
// 		console.error('OffscreenImage.copyFromImage() : srcLeft is', srcLeft);
// 		console.error('OffscreenImage.copyFromImage() : srcTop is', srcTop);
// 		console.error('OffscreenImage.copyFromImage() : dstLeft is', dstLeft);
// 		console.error('OffscreenImage.copyFromImage() : dstTop is', dstTop);
// 		console.error('OffscreenImage.copyFromImage() : width is', width);
// 		console.error('OffscreenImage.copyFromImage() : height is', height);
// 	}

// 	// The most generic image data copier:

// 	// public copyFromImageToImage(
// 	// 	srcImage: IImage,
// 	// 	srcLeft: number,
// 	// 	srcTop: number,
// 	// 	dstImage: IImage,
// 	// 	dstLeft: number,
// 	// 	dstTop: number,
// 	// 	width: number,
// 	// 	height: number
// 	// ): void { ... }
// 	public copyFromArrayToArray(
// 		srcData: Uint8ClampedArray,
// 		srcLeft: number,
// 		srcTop: number,
// 		srcImageWidth: number,
// 		srcImageHeight: number,
// 		srcBytesPerPixel: number,
// 		srcBytesPerLine: number,
// 		dstData: Uint8ClampedArray,
// 		dstLeft: number,
// 		dstTop: number,
// 		dstImageWidth: number,
// 		dstImageHeight: number,
// 		dstBytesPerPixel: number,
// 		dstBytesPerLine: number,
// 		width: number,
// 		height: number
// 	): void {
// 		console.error(
// 			'OffscreenImage.copyFromArrayToArray() : Not implemented'
// 		);

// 		// First, crop the region of interest (ROI).
// 		// Cropping may change any of: srcLeft, srcTop, dstLeft, dstTop, width, height.

// 		// Then copy using a double loop.
// 		let srcRowOffset =
// 			srcTop * srcBytesPerLine + srcLeft * srcBytesPerPixel;
// 		let dstRowOffset =
// 			dstTop * dstBytesPerLine + dstLeft * dstBytesPerPixel;

// 		for (let y = 0; y < height; y++) {
// 			let srcPixelOffset = srcRowOffset;
// 			let dstPixelOffset = dstRowOffset;

// 			for (let x = 0; x < width; x++) {
// 				dstData[dstPixelOffset + 3] = srcData[srcPixelOffset + 3];
// 				dstData[dstPixelOffset + 2] = srcData[srcPixelOffset + 2];
// 				dstData[dstPixelOffset + 1] = srcData[srcPixelOffset + 1];
// 				dstData[dstPixelOffset + 0] = srcData[srcPixelOffset + 0];

// 				srcPixelOffset += srcBytesPerPixel;
// 				dstPixelOffset += dstBytesPerPixel;
// 			}

// 			srcRowOffset += srcBytesPerLine;
// 			dstRowOffset += dstBytesPerLine;
// 		}
// 	}
// }

class CanvasImage extends ImageBase implements ICanvasImage {
	public readonly canvas: ElementRef<HTMLCanvasElement>;
	public readonly context: CanvasRenderingContext2D;
	public readonly imageData: ImageData;

	constructor(canvas: ElementRef<HTMLCanvasElement>) {
		const context = canvas.nativeElement.getContext('2d');

		if (!context) {
			throw new Error(
				"CanvasImage constructor: The canvas's context is falsy"
			);
		}

		const imageData = context.createImageData(
			canvas.nativeElement.width,
			canvas.nativeElement.height
		);

		super(imageData.width, imageData.height, imageData.data);

		this.canvas = canvas;
		this.context = context;
		this.imageData = imageData;
	}

	public asImageData(): ImageData {
		return this.imageData;
	}

	public async asImageBitmap(): Promise<ImageBitmap> {
		return await createImageBitmap(this.asImageData());
	}

	public copyFromArray(
		arrayImageWidth: number,
		arrayImageHeight: number,
		arrayImageData: Uint8ClampedArray
	): void {
		const croppedWidth = Math.min(arrayImageWidth, this.width);
		const croppedHeight = Math.min(arrayImageHeight, this.height);
		const p = arrayImageData;
		const srcBytesPerPixel = 4;
		const srcBytesPerLine = arrayImageWidth * srcBytesPerPixel;
		let rowOffset = 0;

		for (let y = 0; y < croppedHeight; y++) {
			let pixelOffset = rowOffset;

			for (let x = 0; x < croppedWidth; x++) {
				this.context.fillStyle = `rgba(${p[pixelOffset + 0]},${
					p[pixelOffset + 1]
				},${p[pixelOffset + 2]},${p[pixelOffset + 3]})`;
				this.context.fillRect(x, y, 1, 1);
				pixelOffset += srcBytesPerPixel;
			}

			rowOffset += srcBytesPerLine;
		}
	}

	public async drawOnCanvas(dx = 0, dy = 0): Promise<void> {
		this.context.drawImage(await this.asImageBitmap(), dx, dy);
	}
}

// export function createOffscreenImage(
// 	width: number,
// 	height: number,
// 	data?: Uint8ClampedArray,
// 	options?: ICreateImageOptions
// ): IOffscreenImage {
// 	return new OffscreenImage(width, height, data, options);
// }

export function createCanvasImage(
	canvas: ElementRef<HTMLCanvasElement>
): ICanvasImage {
	return new CanvasImage(canvas);
}
