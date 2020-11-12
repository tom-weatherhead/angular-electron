// angular-electron/src/app/components/dashboard/dashboard.component.ts

// Declaring ngDoCheck and ngOnChanges method in a class is not recommended

import {
	AfterContentChecked,
	// AfterContentInit, // lifecycle
	// AfterViewChecked, // lifecycle
	// AfterViewInit,
	ChangeDetectorRef,
	Component,
	// DoCheck, // lifecycle
	ElementRef,
	// OnChanges, // lifecycle
	OnInit,
	ViewChild
} from '@angular/core';

import { IpcRendererEvent } from 'electron';

// import * as _ from 'lodash';

// import {
// 	getDateTimeUTCString,
// 	getLastElementOfArray,
// 	ifDefinedThenElse
// } from 'thaw-common-utilities.ts';

// Interfaces

import { createCanvasImage } from '../../models/image.model';

// Services

import { ConfigurationService } from '../../services/configuration/configuration.service';

import { ElectronService } from '../../services/electron/electron.service';

import { FileService } from '../../services/file/file.service';

import { LoggerService } from '../../services/logger/logger.service';

import { PaletteComponent } from '../palette/palette.component';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
/* implements AfterContentChecked */
export class DashboardComponent implements AfterContentChecked, OnInit {
	@ViewChild('sampleCanvas', { static: false })
	sampleCanvas: ElementRef<HTMLCanvasElement>;

	@ViewChild('palette', { static: false })
	palette: PaletteComponent;

	public isCanvasVisible = true;
	public configObsoText = '';
	public ipcPongSpanText = '';

	private subscribedToSelectedColourObservable = false;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private configurationService: ConfigurationService,
		private electronService: ElectronService,
		private fileService: FileService,
		private loggerService: LoggerService
	) {}

	public ngOnInit(): void {
		if (this.electronService.isAvailable) {
			console.log('The Electron service is available.');
		} else {
			console.error('The Electron service is *NOT* available.');
		}
	}

	public ngAfterContentChecked(): void {
		// console.log('Dashboard ngAfterContentChecked()');
		// 2020-10-30 : Successful test of file system access via Electron:

		// console.log(
		// 	'electronService.fs is',
		// 	typeof this.electronService.fs,
		// 	this.electronService.fs
		// );

		// console.log(
		// 	this.electronService.fs.readFileSync('/Users/tomw/.npmrc', {
		// 		encoding: 'utf8',
		// 		flag: 'r'
		// 	})
		// );

		// console.log(this.configurationService.get());

		// this.electronService.openGitHubInBrowser();

		if (
			typeof this.palette !== 'undefined' &&
			!this.subscribedToSelectedColourObservable
		) {
			this.palette.selectedColourObservable.subscribe(
				(selectedColour: string) => {
					console.log(
						'Dashboard: selectedColour is',
						selectedColour
					);
				}
			);
			this.subscribedToSelectedColourObservable = true;
		}
	}

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
			/* eslint-disable @typescript-eslint/no-unused-vars */
			event: IpcRendererEvent,
			...args: unknown[]
		): /* eslint-enable @typescript-eslint/no-unused-vars */
		void => {
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
		this.configurationService
			.get()
			.then((config) => {
				console.log('Config is', config);
				this.configObsoText = `Obso${config.obso}`;
				this.changeDetectorRef.detectChanges();
			})
			.catch((error) => {
				console.error(
					'DashboardComponent configurationService.get() error:',
					typeof error,
					error
				);
			});
	}

	public async onClickImageTest(): Promise<void> {
		const path = this.electronService.path.join(
			this.electronService.cwd(),
			'src/assets/images/image256x256.jpg'
		);
		const image = await this.fileService.loadJpegImageFromFile(path);
		const canvasImage = createCanvasImage(this.sampleCanvas);

		canvasImage.copyFromArray(image.width, image.height, image.data);
		canvasImage.drawOnCanvas(0, 0);
		// this.isCanvasVisible = true;
		this.changeDetectorRef.detectChanges();
	}
}
