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

	public get(): IAppConfigurationData {
		let str = '';

		try {
			str = this.electronService.fs.readFileSync(
				this.electronService.path.join(
					this.electronService.cwd(),
					'config',
					'config.json'
				),
				{
					encoding: 'utf8',
					flag: 'r'
				}
			);
		} catch (error) {
			console.error(
				'Error in ConfigurationService.get() :',
				typeof error,
				error
			);
		}

		const defaultConfig: IAppConfigurationData = {
			foo: 'default',
			obso: 911
		};

		return safeJsonParse(str, defaultConfig);
	}
}
