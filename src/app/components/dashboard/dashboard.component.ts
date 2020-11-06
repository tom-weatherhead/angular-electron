// angular-electron/src/app/components/dashboard/dashboard.component.ts

// Declaring ngDoCheck and ngOnChanges method in a class is not recommended

import {
	AfterContentChecked,
	// AfterContentInit, // lifecycle
	// AfterViewChecked, // lifecycle
	// AfterViewInit,
	// ChangeDetectorRef,
	Component // ,
	// DoCheck, // lifecycle
	// OnChanges, // lifecycle
	// OnInit,
	// ViewChild
} from '@angular/core';

// import * as _ from 'lodash';

// import {
// 	getDateTimeUTCString,
// 	getLastElementOfArray,
// 	ifDefinedThenElse
// } from 'thaw-common-utilities.ts';

import { periodSecondsToString } from '../../utilities';

// Interfaces

// Page base class

import { LineChartPageBaseComponent } from '../line-chart-page-base/line-chart-page-base.component';

// Services

import { ConfigurationService } from '../../services/configuration/configuration.service';

import { ElectronService } from '../../services/electron/electron.service';

import { LoggerService } from '../../services/logger/logger.service';

// const maxOhlcvCacheLength = 350;
// const numUnseenCandlesToFetch = 50;

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent
	extends LineChartPageBaseComponent
	implements AfterContentChecked {
	private hasStrategyEngineBeenInitialized = false;
	// private mostRecentUTCMonth = -1;
	// private quoteDisplayStartIndex = 0;

	private previousDashboardChartsWrapperClientWidth = -1;
	private previousDashboardChartsWrapperClientHeight = -1;

	public quoteSymbol = '';

	public strategyNames: string[] = [];
	public strategyName = '';

	public indicatorNames: string[] = [];
	public indicatorName = '';
	// public indicatorName = this.indicatorNames[0];

	public readonly takeProfitValues = [
		0.0005, // 50 pips
		0.001, // 100 pips
		0.002,
		0.003,
		0.005,
		0.007,
		0.01,
		0.02,
		0.05
	];
	public takeProfitValue = 0; // 0.01;

	public readonly trailingStopLossValues = [
		0.00005, // 5 pips
		0.0001, // 10 pips
		0.0002, // 20 pips
		0.0003, // 30 pips
		0.0004, // 40 pips
		0.0005, // 50 pips
		0.001, // 100 pips
		0.002,
		0.003,
		0.005,
		0.007,
		0.01,
		0.02,
		0.05
	];
	// public trailingStopLossValue = 0; // 0.005;
	public trailingStopLossValue = 0.0004;

	public readonly chartPeriods = [0, 2, 10, 60, 300, 900, 1800, 3600].map(
		(n) => {
			return { name: periodSecondsToString(n), valueInSeconds: n };
		}
	);
	public chartPeriodInSeconds = this.chartPeriods[0].valueInSeconds;

	// Show or hide overlays
	// public showInfimumLine = false;
	// public showSupremumLine = false;
	// public showBestFitLine = false;
	public showBollingerBands = false;
	public showDemaLine = false;
	public showEbb = false;
	public showEMA20Line = false;
	public showKeltner = false;
	public showPriceFilterLine = false;
	public showPsarLine = false;
	public showSMA20Line = true;
	public showSMA50Line = false;
	public showSMA200Line = false;
	public showTemaLine = false;
	public showVBPLine = false;
	public showVWAPLine = false;
	public showVWMALine = false;
	public showZigzagLine = false;

	// Show or hide metadata
	public showBidAsk = false;
	public showLatency = false;
	public showIndicatorSpread = false;
	public showVolume = false;

	public chartsTitleText = '';

	constructor(
		private configurationService: ConfigurationService,
		private electronService: ElectronService,
		private loggerService: LoggerService
	) {
		super();

		/* if (window) {
			// Electron: Handle the window resize event:
			// See https://discuss.atom.io/t/electron-window-resize-event/26049/3

			// window.addEventListener('resize', function(e){
			// 	e.preventDefault();
			// 	that.onWindowResize();
			// });

			// Then create a service (similar to the message service)
			// that handles the window resize event by calling Subject.next()
			// to broadcast notifications to the Subject's subscribers.

			// import { Subject } from 'rxjs';

			// Also from https://discuss.atom.io/t/electron-window-resize-event/26049/3
			// let currentWindow = remote.getCurrentWindow().removeAllListeners();

			// currentWindow.on('resize', _.debounce(function () {
			// 	that.onWindowResize();
			// }, 100));

			// TODO? : First, remove all other listeners to the window resize event?
			// console.log('**** Adding a window resize event listener ****');

			// const eventName = 'resize';

			// **** 1) Use browserWindow -> This does not yet work ****

			// TODO: In updateChartSizes(), replace calls to
			// window.document.getElementById() with Electron-specific code.

			// Also, e2e testing will fail on Electron-dependent code
			// until e2e testing uses Electron instead of Chrome.

			// const browserWindow = this.electronService.getCurrentWindow();

			// browserWindow.removeAllListeners(eventName);

			// console.log(
			// 	'browserWindow is',
			// 	typeof browserWindow,
			// 	browserWindow
			// );

			// browserWindow.addListener(
			// 	eventName,
			// 	_.debounce(() => {
			// 		// e.preventDefault();
			// 		// that.onWindowResize();
			// 		// console.log('Window resize event:', typeof e, e);
			// 		this.updateChartSizes();
			// 	}, 100)
			// );

			// **** 2) Use window -> This does work ****

			// window.removeAllListeners(eventName);
			// window.addEventListener(
			// 	eventName,
			// 	_.debounce((e) => {
			// 		e.preventDefault();
			// 		// that.onWindowResize();
			// 		// console.log('Window resize event:', typeof e, e);
			// 		this.updateChartSizes();
			// 	}, 100)
			// );
		} */

		this.setPageOptions({
			delayBetweenQuotesInMilliseconds: 60000,
			getAvailableSymbolsOnInit: true,
			showTwoPriceLines: false
		});

		// The app fetches the list of available symbols
		// from the Web service; e.g. http://localhost:8000/symbols

		// The app fetches the list of available strategies
		// from the golden-goose-strategy-engine
		// this.strategyNames = strategyNames;

		// TODO: In the dataFeedProvider DDL, select the item corresponding to this.dataFeedProvider

		this.delayBetweenBarsInSeconds = this.chartPeriodInSeconds;
	}

	public ngAfterContentChecked(): void {
		// 2020-10-30 : Successful test of file system access via Electron:

		console.log(
			'electronService.fs is',
			typeof this.electronService.fs,
			this.electronService.fs
		);

		// console.log(
		// 	this.electronService.fs.readFileSync('/Users/tomw/.npmrc', {
		// 		encoding: 'utf8',
		// 		flag: 'r'
		// 	})
		// );

		// console.log(this.configurationService.get());

		// this.electronService.openGitHubInBrowser();
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

		if (!this.quoteSymbol) {
			console.error('onClickStart(): this.quoteSymbol is falsy');
		} else if (!this.strategyName) {
			console.error('onClickStart(): this.strategyName is falsy');
		} else if (!this.indicatorName) {
			console.error('onClickStart(): this.indicatorName is falsy');
		} else {
			super.onClickStart();
		}
	}

	// public onClickReset(): void {
	// 	super.onClickReset();

	// 	// this.mostRecentUTCMonth = -1;
	// }

	// public onClickU(): void {
	// 	this.updateChartSizes();

	// 	if (this.electronService.isAvailable) {
	// 		console.log('The Electron service is available.');
	// 	} else {
	// 		console.error('The Electron service is *NOT* available.');
	// 	}
	// }
}
