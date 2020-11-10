// angular-electron/src/app/components/dashboard/dashboard.component.ts

// Declaring ngDoCheck and ngOnChanges method in a class is not recommended

import {
	// AfterContentChecked,
	// AfterContentInit, // lifecycle
	// AfterViewChecked, // lifecycle
	// AfterViewInit,
	ChangeDetectorRef,
	Component,
	// DoCheck, // lifecycle
	// OnChanges, // lifecycle
	OnInit // ,
	// ViewChild
} from '@angular/core';

import { IpcRendererEvent } from 'electron';

// import * as _ from 'lodash';

// import {
// 	getDateTimeUTCString,
// 	getLastElementOfArray,
// 	ifDefinedThenElse
// } from 'thaw-common-utilities.ts';

// Interfaces

// Services

import { ConfigurationService } from '../../services/configuration/configuration.service';

import { ElectronService } from '../../services/electron/electron.service';

import { LoggerService } from '../../services/logger/logger.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
/* implements AfterContentChecked */
export class DashboardComponent implements OnInit {
	public ipcPongSpanText = '';

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private configurationService: ConfigurationService,
		private electronService: ElectronService,
		private loggerService: LoggerService
	) {}

	public ngOnInit(): void {
		if (this.electronService.isAvailable) {
			console.log('The Electron service is available.');
		} else {
			console.error('The Electron service is *NOT* available.');
		}
	}

	// public ngAfterContentChecked(): void {
	// 	console.log('Dashboard ngAfterContentChecked()');
	// 	// 2020-10-30 : Successful test of file system access via Electron:

	// 	// console.log(
	// 	// 	'electronService.fs is',
	// 	// 	typeof this.electronService.fs,
	// 	// 	this.electronService.fs
	// 	// );

	// 	// console.log(
	// 	// 	this.electronService.fs.readFileSync('/Users/tomw/.npmrc', {
	// 	// 		encoding: 'utf8',
	// 	// 		flag: 'r'
	// 	// 	})
	// 	// );

	// 	// console.log(this.configurationService.get());

	// 	// this.electronService.openGitHubInBrowser();
	// }

	public onClickStart(): void {
		// this.loggerService.writeTest();

		// this.electronService
		// 	.testChildProcessExec('ls -lh /Users/tomw')
		// 	.then((result: string) => {
		// 		console.log('testChildProcessExec result:\n', result);
		// 	})
		// 	.catch((error: unknown) => {
		// 		console.error(
		// 			'testChildProcessExec error:',
		// 			typeof error,
		// 			error
		// 		);
		// 	});

		// console.log(
		// 	'Clipboard:',
		// 	this.electronService.getSelectedTextFromClipboard()
		// );
		this.electronService.showAboutPanel();
	}

	public onClickIpcPing(): void {
		const fnIpcPongListener = (
			event: IpcRendererEvent,
			...args: unknown[]
		): void => {
			console.log('IPC Pong!');
			this.ipcPongSpanText = 'IPC Pong!';
			this.changeDetectorRef.detectChanges();
			setTimeout(() => {
				this.ipcPongSpanText = '';
				this.changeDetectorRef.detectChanges();
			}, 5000);
		};

		console.log('IPC Ping!');
		this.electronService.addAsynchronousReplyOneTimeListener(
			'ipc-pong',
			fnIpcPongListener
		);
		this.electronService.sendAsynchronousMessage('ipc-ping');
	}

	public onClickReadConfig(): void {
		const config = this.configurationService.get();

		console.log('Config is', config);
	}
}
