// angular-electron/src/app/services/logger/logger.service.ts

// (From the Angular style guide?) : Apparently, a 'service' is any code
// that does not have a corresponding view

import { Injectable } from '@angular/core';

import { ElectronService } from '../electron/electron.service';

@Injectable({
	providedIn: 'root'
})
export class LoggerService {
	constructor(private electronService: ElectronService) {}

	public writeTest(): void {
		this.electronService.fs.writeFileSync(
			'/Users/tomw/test1.txt',
			'angular-electron LoggerService: This is a writeFileSync test.',
			{
				encoding: 'utf8',
				flag: 'w',
				mode: 0o666
			}
		);
		console.log(
			this.electronService.fs.readFileSync('/Users/tomw/test1.txt', {
				encoding: 'utf8',
				flag: 'r'
			})
		);
	}
}
