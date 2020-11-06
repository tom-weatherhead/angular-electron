// angular-electron/src/app/services/file.service.ts

import { Injectable } from '@angular/core';

import { IpcRendererEvent } from 'electron';

import {
	// ICreateImageOptions,
	IImage
} from '../../interfaces/iimage.interface';

import { ElectronService } from '../electron/electron.service';

import {
	// createCanvasImage,
	// createImage
	// createImageFromExistingData
	createOffscreenImage
} from '../../models/image.model';

interface IElectronOffscreenImage {
	width: number;
	height: number;
	data?: Uint8ClampedArray;
}

@Injectable({
	providedIn: 'root'
})
export class FileService {
	constructor(private electronService: ElectronService) {}

	public loadJpegImageFromFile(filePath: string): Promise<IImage> {
		if (!this.electronService.isAvailable) {
			throw new Error(
				'FileService.loadJpegImageFromFile() : Electron is unavailable'
			);
		}

		return new Promise<IImage>(
			(
				resolve: (value?: IImage) => void,
				reject: (reason?: unknown) => void
			): void => {
				// TODO: Load the image in an Electron NativeImage

				this.electronService.addAsynchronousReplyOneTimeListener(
					'load-jpeg-image-reply',
					(event: IpcRendererEvent, ...args: unknown[]): void => {
						if (!args || !args.length) {
							reject(
								new Error(
									`loadJpegImageFromFile(${filePath}) : Bad args in reply`
								)
							);
						}

						const argZero = args[0] as IElectronOffscreenImage;

						if (typeof argZero === 'undefined') {
							reject(
								new Error(
									'Loaded JPEG image is not an IElectronOffscreenImage'
								)
							);
						}

						const image = createOffscreenImage(
							argZero.width,
							argZero.height,
							argZero.data
						);

						resolve(image);
					}
				);

				this.electronService.sendAsynchronousMessage(
					'load-jpeg-image-message',
					filePath
				);
			}
		);
	}
}
