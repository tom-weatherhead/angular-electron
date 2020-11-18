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

import * as _ from 'lodash';

// import {
// 	getDateTimeUTCString,
// 	getLastElementOfArray,
// 	ifDefinedThenElse
// } from 'thaw-common-utilities.ts';

import {
	compositeTest,
	desaturateRGBA,
	flipImage,
	gaussianBlurImage,
	IThAWImage,
	mapColoursInImageFromBuffer,
	mirrorImage,
	pixelateImageFromBuffer,
	// resampleImageFromBuffer,
	// ResamplingMode,
	rotate180DegreesFromImage,
	rotate90DegreesClockwiseFromImage,
	rotate90DegreesCounterclockwiseFromImage
} from 'thaw-image-processing.ts';

// Interfaces

import { createCanvasImage } from '../../models/image.model';

// Services

import { ConfigurationService } from '../../services/configuration/configuration.service';

import { ElectronService } from '../../services/electron/electron.service';

import { FileService } from '../../services/file/file.service';

import { LoggerService } from '../../services/logger/logger.service';

// Components

import { BasicCanvasComponent } from '../basic-canvas/basic-canvas.component';

import { PaletteComponent } from '../palette/palette.component';

// Use this function when resizing / cropping / matting an image
// in order to display it in an HTML canvas:

// function mapImageRectToCanvasRect(
// 	imageWidth: number,
// 	imageHeight: number,
// 	canvasWidth: number,
// 	canvasHeight: number,
// 	scaleToFit: boolean,
// 	preserveAspectRatio: boolean
// ): { x: number; y: number; w: number; h: number; needsMatting: boolean } {
// 	if (!scaleToFit) {
// 		return {
// 			x: Math.floor((canvasWidth - imageWidth) / 2),
// 			y: Math.floor((canvasHeight - imageHeight) / 2),
// 			w: imageWidth,
// 			h: imageHeight,
// 			needsMatting:
// 				imageWidth < canvasWidth || imageHeight < canvasHeight
// 		};
// 	} else if (!preserveAspectRatio) {
// 		return {
// 			x: 0,
// 			y: 0,
// 			w: canvasWidth,
// 			h: canvasHeight,
// 			needsMatting: false
// 		};
// 	} else if (imageWidth * canvasHeight >= imageHeight * canvasWidth) {
// 		const newImageHeight = Math.round(
// 			(imageHeight * canvasWidth) / imageWidth
// 		); // <= canvasHeight

// 		return {
// 			x: 0,
// 			y: Math.floor((canvasHeight - newImageHeight) / 2),
// 			w: canvasWidth,
// 			h: newImageHeight,
// 			needsMatting: newImageHeight < canvasHeight
// 		};
// 	} else {
// 		const newImageWidth = Math.round(
// 			(imageWidth * canvasHeight) / imageHeight
// 		); // <= canvasWidth

// 		return {
// 			x: Math.floor((canvasWidth - newImageWidth) / 2),
// 			y: 0,
// 			w: newImageWidth,
// 			h: canvasHeight,
// 			needsMatting: newImageWidth < canvasWidth
// 		};
// 	}
// }

// function loadJpegImageIntoCanvas(jpegImagePath: string, canvas: ElementRef<HTMLCanvasElement>, scaleToFit: boolean, preserveAspectRatio: boolean): void {
// 	const foo = mapImageRectToCanvasRect(imageWidth, imageHeight, canvasWidth, canvasHeight, scaleToFit, preserveAspectRatio);
// }

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
/* implements AfterContentChecked */
export class DashboardComponent implements AfterContentChecked, OnInit {
	// @ViewChild('imageCanvas', { static: false })
	// imageCanvas: ElementRef<HTMLCanvasElement>;

	@ViewChild('srcImageCanvas', { static: false })
	srcImageCanvas: ElementRef<HTMLCanvasElement>;

	@ViewChild('dstImageCanvas', { static: false })
	dstImageCanvas: ElementRef<HTMLCanvasElement>;

	@ViewChild('palette', { static: false })
	palette: PaletteComponent;

	@ViewChild('basicCanvas', { static: false })
	basicCanvas: BasicCanvasComponent;

	// public isCanvasVisible = true;
	public configObsoText = '';
	public ipcPongSpanText = '';

	private subscribedToSelectedColourObservable = false;

	private haveImagesBeenInitialized = false;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private configurationService: ConfigurationService,
		private electronService: ElectronService,
		private fileService: FileService,
		private loggerService: LoggerService
	) {
		if (window) {
			window.addEventListener(
				'resize',
				_.debounce((e) => {
					e.preventDefault();
					// that.onWindowResize();
					// console.log('Window resize event:', typeof e, e);
					this.updateBasicCanvasSize();
				}, 100)
			);
		}
	}

	public ngOnInit(): void {
		if (this.electronService.isAvailable) {
			console.log('The Electron service is available.');
		} else {
			console.error('The Electron service is *NOT* available.');
		}
	}

	public async ngAfterContentChecked(): Promise<void> {
		// if (!this.subscribedToSelectedColourObservable) {
		// 	console.log('DashboardComponent.ngAfterContentChecked()');
		// }

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
			console.log(
				'DashboardComponent.ngAfterContentChecked() : Subscribe to palette clicks'
			);

			this.palette.selectedColourObservable.subscribe(
				(selectedColour: string) => {
					// console.log(
					// 	'Dashboard: selectedColour is',
					// 	selectedColour
					// );
					// this.selectedColour = selectedColour;
					this.basicCanvas.selectedColour = selectedColour;
					// this.basicCanvas.drawFilledRectangle(
					// 	0,
					// 	0,
					// 	100,
					// 	100,
					// 	selectedColour
					// );
				}
			);
			this.subscribedToSelectedColourObservable = true;
		}

		if (!this.haveImagesBeenInitialized) {
			const imagesDir = this.electronService.path.join(
				this.electronService.cwd(),
				'src',
				'assets',
				'images'
			);

			const path512 = this.electronService.path.join(
				imagesDir,
				'image512x512.jpg'
			);
			const srcImage512x512 = await this.fileService.loadJpegImageFromFile(
				path512
			);

			const canvasSrcImage = createCanvasImage(this.srcImageCanvas);
			const canvasDstImage = createCanvasImage(this.dstImageCanvas);

			// TODO:
			canvasSrcImage.copyFromImage(srcImage512x512);
			// canvasSrcImage.copyFromArray(
			// 	srcImage512x512.width,
			// 	srcImage512x512.height,
			// 	srcImage512x512.data
			// );
			canvasSrcImage.drawOnCanvas(0, 0);

			canvasDstImage.clearCanvas();

			this.changeDetectorRef.detectChanges();

			this.haveImagesBeenInitialized = true;
		}
	}

	public onClickStart(): void {
		// this.loggerService.writeTest();

		this.electronService
			// .executeChildProcess(`ls -lh ${this.electronService.cwd()}`)
			.executeChildProcess('date')
			.then((result: string) => {
				console.log('executeChildProcess result:\n', result);
			})
			.catch((error: unknown) => {
				console.error(
					'executeChildProcess error:',
					typeof error,
					error
				);
			});

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

	// public async onClickImageTest(): Promise<void> {
	// 	const imagesDir = this.electronService.path.join(
	// 		this.electronService.cwd(),
	// 		'src',
	// 		'assets',
	// 		'images'
	// 	);
	// 	const path256 = this.electronService.path.join(
	// 		imagesDir,
	// 		'image256x256.jpg'
	// 	);
	// 	const path512 = this.electronService.path.join(
	// 		imagesDir,
	// 		'image512x512.jpg'
	// 	);
	// 	const image256x256 = await this.fileService.loadJpegImageFromFile(
	// 		path256
	// 	);
	// 	const image = resampleImageFromBuffer(
	// 		image256x256,
	// 		200,
	// 		100,
	// 		ResamplingMode.Bicubic
	// 	);
	// 	// BUG in bicubic upsampling? Investigate.
	// 	const srcImage512x512 = await this.fileService.loadJpegImageFromFile(
	// 		path512
	// 	);
	// 	// const dstImage512x512 = pixelateImageFromBuffer(srcImage512x512, 8);

	// 	const sigma = 4.0;
	// 	const kernelSize = 21; // kernelSize must be an odd positive integer smaller than 999.
	// 	const dstImage512x512 = gaussianBlurImage(
	// 		srcImage512x512,
	// 		sigma,
	// 		kernelSize
	// 	);

	// 	const canvasImage = createCanvasImage(this.imageCanvas);
	// 	const canvasSrcImage = createCanvasImage(this.srcImageCanvas);
	// 	const canvasDstImage = createCanvasImage(this.dstImageCanvas);

	// 	// TODO: canvasImage.copyFromImage(image);
	// 	canvasImage.copyFromArray(image.width, image.height, image.data);
	// 	canvasImage.drawOnCanvas(0, 0);

	// 	canvasSrcImage.copyFromArray(
	// 		srcImage512x512.width,
	// 		srcImage512x512.height,
	// 		srcImage512x512.data
	// 	);
	// 	canvasSrcImage.drawOnCanvas(0, 0);

	// 	canvasDstImage.copyFromArray(
	// 		dstImage512x512.width,
	// 		dstImage512x512.height,
	// 		dstImage512x512.data
	// 	);
	// 	canvasDstImage.drawOnCanvas(0, 0);

	// 	this.changeDetectorRef.detectChanges();
	// }

	public async onClickProcessImage(operator: string): Promise<void> {
		const imagesDir = this.electronService.path.join(
			this.electronService.cwd(),
			'src',
			'assets',
			'images'
		);
		const path512 = this.electronService.path.join(
			imagesDir,
			'image512x512.jpg'
		);
		const srcImage512x512 = await this.fileService.loadJpegImageFromFile(
			path512
		);

		let dstImage512x512: IThAWImage;

		const sigma = 4.0;
		const kernelSize = 21; // kernelSize must be an odd positive integer smaller than 999.

		switch (operator) {
			case 'composite':
				dstImage512x512 = compositeTest(srcImage512x512);
				break;

			case 'desaturate':
				dstImage512x512 = mapColoursInImageFromBuffer(
					srcImage512x512,
					desaturateRGBA
				);
				break;

			case 'flip':
				dstImage512x512 = flipImage(srcImage512x512);
				break;

			case 'gaussian-blur':
				dstImage512x512 = gaussianBlurImage(
					srcImage512x512,
					sigma,
					kernelSize
				);
				break;

			case 'mirror':
				dstImage512x512 = mirrorImage(srcImage512x512);
				break;

			case 'pixelate':
				dstImage512x512 = pixelateImageFromBuffer(srcImage512x512, 8);
				break;

			case 'rot90cw':
				dstImage512x512 = rotate90DegreesClockwiseFromImage(
					srcImage512x512
				);
				break;

			case 'rot180':
				dstImage512x512 = rotate180DegreesFromImage(srcImage512x512);
				break;

			case 'rot90ccw':
				dstImage512x512 = rotate90DegreesCounterclockwiseFromImage(
					srcImage512x512
				);
				break;

			default:
				throw new Error(`Unsupported image operation '${operator}'`);
		}

		const canvasDstImage = createCanvasImage(this.dstImageCanvas);

		canvasDstImage.copyFromArray(
			dstImage512x512.width,
			dstImage512x512.height,
			dstImage512x512.data
		);
		canvasDstImage.drawOnCanvas(0, 0);

		this.changeDetectorRef.detectChanges();
	}

	public async onClickProgress(n = 0): Promise<void> {
		await this.electronService.setProgressBarValue(n);

		if (n >= 0) {
			if (n >= 1) {
				n = -1; // Hide the progress bar
			} else {
				n += 0.125 * 0.125; // 1 / 64
			}

			setTimeout(async () => {
				await this.onClickProgress(n);
			}, 125);
		}
	}

	private updateBasicCanvasSize(): void {
		if (!this.basicCanvas) {
			return;
		}

		// const pageContentHeader = window.document.getElementById(
		// 	'page-content-header'
		// );
		// const controlsWrapper = window.document.getElementById(
		// 	'dashboard-controls-wrapper'
		// );
		const basicCanvasWrapper = window.document.getElementById(
			'dashboard-basic-canvas-wrapper'
		);

		// if (!pageContentHeader || !controlsWrapper || !chartsWrapper) {
		// 	return;
		// }

		if (!basicCanvasWrapper) {
			return;
		}

		const widthReservedForOtherHorizontalSpacing = 20;
		// const heightReservedForOtherVerticalSpacing = 20;

		// if (
		// 	chartsWrapper.clientWidth !==
		// 		this.previousDashboardChartsWrapperClientWidth ||
		// 	chartsWrapper.clientHeight !==
		// 		this.previousDashboardChartsWrapperClientHeight
		// ) {
		const w =
			basicCanvasWrapper.clientWidth -
			widthReservedForOtherHorizontalSpacing;
		// const h =
		// 	window.innerHeight -
		// 	pageContentHeader.clientHeight -
		// 	controlsWrapper.clientHeight -
		// 	heightReservedForOtherVerticalSpacing;
		// const h2 = Math.round(h / 3);
		// const h1 = h - h2;

		this.basicCanvas.setCanvasSize(w, 500);

		// this.previousDashboardChartsWrapperClientWidth =
		// 	chartsWrapper.clientWidth;
		// this.previousDashboardChartsWrapperClientHeight =
		// 	chartsWrapper.clientHeight;
		// }
	}
}
