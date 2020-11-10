// angular-electron/src/app/services/configuration/configuration.service.ts

import { Injectable } from '@angular/core';

import { safeJsonParse } from 'thaw-common-utilities.ts';

import { ElectronService } from '../electron/electron.service';

export interface IAppConfigurationData {
	foo: string;
	obso: number;
}

@Injectable({
	providedIn: 'root'
})
export class ConfigurationService {
	constructor(private electronService: ElectronService) {}

	public async get(): Promise<IAppConfigurationData> {
		const path = this.electronService.path.join(
			this.electronService.cwd(),
			'config',
			'config.json'
		);
		const defaultConfig: IAppConfigurationData = {
			foo: 'default',
			obso: 911
		};

		return safeJsonParse(
			await this.electronService.fs.promises.readFile(path, {
				encoding: 'utf8',
				flag: 'r'
			}),
			defaultConfig
		);
	}
}
