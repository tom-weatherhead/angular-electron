// angular-electron/src/app/components/line-chart-page-base/line-chart-page-base.component.ts

'use strict';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { /* Observable, of, */ Subject } from 'rxjs';

// import { switchMap, takeUntil } from 'rxjs/operators';

import {
	// getDateTimeUTCString,
	// getIntervalStringFromMilliseconds,
	ifDefinedThenElse // ,
	// removeDuplicatesFromArray
} from 'thaw-common-utilities.ts';

// import { periodSecondsToString } from '../../utilities';

interface ILineChartPageBaseOptions {
	delayBetweenQuotesInMilliseconds?: number;
	enableTiming?: boolean;
	getAvailableSymbolsOnInit?: boolean;
	maxNumPrices?: number;
	showTwoPriceLines?: boolean;
}

const defaultDigits = 5;

// const minDelayBetweenQuotesInMilliseconds = 125;
// const defaultDelayBetweenQuotesInMilliseconds = 1000;
// const maxDelayBetweenQuotesInMilliseconds = 8000;

// const minDelayBetweenBarsInMilliseconds = 100;
// const minDelayBetweenBarsInMilliseconds = 240000; // 4 minutes

// const defaultDelayBetweenBarsInSeconds = 300; // 5 minutes
const defaultDelayBetweenBarsInSeconds = 900; // 15 minutes
// const defaultDelayBetweenBarsInSeconds = 1800; // 30 minutes

// const defaultDelayBetweenBarsInMilliseconds =
// 	defaultDelayBetweenBarsInSeconds * 1000;

// const requestLatencyCompensationMs = 1000;

const defaultEnableTiming = true;
const defaultGetAvailableSymbolsOnInit = false;
const defaultMaxNumPrices = 33;
const defaultShowTwoPriceLines = false;

@Component({
	// templateUrl: './line-chart-page-base.component.html'
	template: ''
})
export class LineChartPageBaseComponent implements OnDestroy, OnInit {
	// protected delayBetweenQuotesInMilliseconds = defaultDelayBetweenQuotesInMilliseconds;
	// protected delayBetweenQuotesInSeconds = defaultDelayBetweenQuotesInSeconds;
	// protected delayBetweenBarsInMilliseconds: number;
	protected delayBetweenBarsInSeconds = defaultDelayBetweenBarsInSeconds;
	private enableTiming: boolean;
	private getAvailableSymbolsOnInit: boolean;
	protected maxNumPrices: number;
	protected showTwoPriceLines: boolean;

	public startButtonDisabled = true;
	public quoteSymbols: string[] = [];
	public dateTimeString = '';
	// public quoteId = 0;
	public wasStopButtonClicked = false;
	protected feedSymbol = 'all';
	protected periodString = 'Undefined';
	protected digits = defaultDigits;
	private unsubscribeToObservables: Subject<boolean>;
	private testRunStartTime: number;

	constructor() {
		this.setPageOptions();
	}

	protected setPageOptions(options: ILineChartPageBaseOptions = {}): void {
		// this.delayBetweenQuotesInMilliseconds = ifDefinedThenElse(
		// 	options.delayBetweenQuotesInMilliseconds,
		// 	defaultDelayBetweenQuotesInMilliseconds
		// );

		this.enableTiming = ifDefinedThenElse(
			options.enableTiming,
			defaultEnableTiming
		);

		this.getAvailableSymbolsOnInit = ifDefinedThenElse(
			options.getAvailableSymbolsOnInit,
			defaultGetAvailableSymbolsOnInit
		);

		this.maxNumPrices = ifDefinedThenElse(
			options.maxNumPrices,
			defaultMaxNumPrices
		);

		this.showTwoPriceLines = ifDefinedThenElse(
			options.showTwoPriceLines,
			defaultShowTwoPriceLines
		);
	}

	public ngOnInit(): void {
		this.unsubscribeToObservables = new Subject<boolean>();
	}

	public ngOnDestroy(): void {
		this.unsubscribeToObservables.next(true);
	}

	public onClickStart(): void {
		this.testRunStartTime = new Date().valueOf();
		this.startButtonDisabled = true;
	}

	public onClickStop(): void {
		this.wasStopButtonClicked = true;
		this.unsubscribeToObservables.next(true);
		this.startButtonDisabled = false;
	}

	public onClickReset(): void {
		// this.quoteId = 0;
		this.dateTimeString = '';
	}

	// public onClickFaster(): void {
	// 	if (
	// 		this.delayBetweenQuotesInMilliseconds >
	// 		minDelayBetweenQuotesInMilliseconds
	// 	) {
	// 		this.delayBetweenQuotesInMilliseconds /= 2;
	// 		this.onClickStop();
	// 		this.onClickStart();
	// 	}
	// }

	// public onClickSlower(): void {
	// 	if (
	// 		this.delayBetweenQuotesInMilliseconds <
	// 		maxDelayBetweenQuotesInMilliseconds
	// 	) {
	// 		this.delayBetweenQuotesInMilliseconds *= 2;
	// 		this.onClickStop();
	// 		this.onClickStart();
	// 	}
	// }

	protected get delayBetweenBarsInMilliseconds(): number {
		return this.delayBetweenBarsInSeconds * 1000;
	}
}
