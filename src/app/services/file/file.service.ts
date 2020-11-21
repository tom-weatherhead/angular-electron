// angular-electron/src/app/services/file.service.ts

import { Injectable } from '@angular/core';

import { createFileIOManager, IThAWImage } from 'thaw-image-processing.ts';

import { ElectronService } from '../electron/electron.service';

@Injectable({
	providedIn: 'root'
})
export class FileService {
	constructor(private electronService: ElectronService) {}

	public async loadImage(filePath: string): Promise<IThAWImage> {
		if (!this.electronService.isAvailable) {
			throw new Error(
				'FileService.loadImage() : Electron is unavailable'
			);
		}

		const fileManager = createFileIOManager(this.electronService.fs);

		return fileManager.load(filePath);
	}
}
