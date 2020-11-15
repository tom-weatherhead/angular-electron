// angular-electron/src/app/services/file.service.ts

import { Injectable } from '@angular/core';

import * as jpeg from 'jpeg-js';

import { CreateThAWImage, IThAWImage } from 'thaw-image-processing.ts';

// import {
// 	// ICreateImageOptions,
// 	IImage
// } from '../../interfaces/iimage.interface';

import { ElectronService } from '../electron/electron.service';

// import {
// 	// createCanvasImage,
// 	// createImage
// 	// createImageFromExistingData
// 	createOffscreenImage
// } from '../../models/image.model';

// interface IElectronOffscreenImage {
// 	width: number;
// 	height: number;
// 	data?: Uint8ClampedArray;
// }

@Injectable({
	providedIn: 'root'
})
export class FileService {
	constructor(private electronService: ElectronService) {}

	// This method creates an offscreen image:

	public async loadJpegImageFromFile(
		filePath: string
	): Promise<IThAWImage> {
		if (!this.electronService.isAvailable) {
			throw new Error(
				'FileService.loadJpegImageFromFile() : Electron is unavailable'
			);
		}

		const jpegData = await this.electronService.fs.promises.readFile(
			filePath
		);
		const image = jpeg.decode(jpegData);

		// The returned value is Promise<{ width: number; height number; data: ? }>

		// return createOffscreenImage(
		// 	image.width,
		// 	image.height,
		// 	Uint8ClampedArray.from(image.data)
		// );

		return CreateThAWImage(image.width, image.height, -1, -1, image.data);
	}
}
