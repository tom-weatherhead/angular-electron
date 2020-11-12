// angular-electron/src/app/components/basic-canvas/basic-canvas.component.ts

// HTML 5 Canvas: See e.g. https://www.w3schools.com/TAgs/ref_canvas.asp

import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	ViewChild
} from '@angular/core';

import { pointwise } from 'thaw-common-utilities.ts';

import { Colours } from 'thaw-colour';

const widthPerDataPoint = 16;
const widthPerDot = 6;

const barXMarginWidth = 2;
const candlestickXMarginWidth = 1;

const barYMarginHeight = 2;

@Component({
	selector: 'app-basic-canvas',
	templateUrl: './basic-canvas.component.html'
})
export class GenericChartCanvasComponent implements AfterViewInit {
	@ViewChild('canvas', { static: true })
	canvas: ElementRef<HTMLCanvasElement>;

	public canvasContext: CanvasRenderingContext2D; // View

	private priceAtCanvasTop = NaN;
	private priceAtCanvasBottom = NaN;
	private autoSetMinY = true;
	private autoSetMaxY = true;

	public canvasWidthValue = 1152;
	public canvasHeightValue = 500;

	constructor(protected changeDetectorRef: ChangeDetectorRef) {}

	ngAfterViewInit(): void {
		this.canvasContext = this.canvas.nativeElement.getContext('2d');
		this.clearCanvas();
	}

	public get minY(): number {
		return this.priceAtCanvasBottom;
	}

	public set minY(value: number) {
		this.priceAtCanvasBottom = value;
		this.autoSetMinY = Number.isNaN(value);
	}

	public get maxY(): number {
		return this.priceAtCanvasTop;
	}

	public set maxY(value: number) {
		this.priceAtCanvasTop = value;
		this.autoSetMaxY = Number.isNaN(value);
	}

	private get canvasWidth(): number {
		return typeof this.canvas !== 'undefined' &&
			typeof this.canvas.nativeElement !== 'undefined'
			? this.canvas.nativeElement.width
			: NaN;
	}

	private get canvasHeight(): number {
		return typeof this.canvas !== 'undefined' &&
			typeof this.canvas.nativeElement !== 'undefined'
			? this.canvas.nativeElement.height
			: NaN;
	}

	public get canvasWidthInDataPoints(): number {
		const w = this.canvasWidth;

		return Number.isNaN(w) ? NaN : Math.floor(w / widthPerDataPoint);
	}

	public setCanvasSize(newRawWidth: number, newRawHeight: number): void {
		// console.log('GenericChartCanvasComponent.setCanvasSize()');
		this.canvasWidthValue =
			Math.floor(newRawWidth / widthPerDataPoint) * widthPerDataPoint;
		this.canvasHeightValue = newRawHeight;
		this.changeDetectorRef.detectChanges();
		this.clearCanvas();
	}

	// private examples(): void {
	// 	// To draw an unfilled rectangle:
	// 	// this.canvasContext.beginPath();
	// 	// this.canvasContext.rect(x, y, w, h);
	// 	// this.canvasContext.stroke();
	// 	// To draw a line:
	// 	// this.canvasContext.beginPath();
	// 	// this.canvasContext.moveTo(x, y);
	// 	// this.canvasContext.lineTo(x, y);
	// 	// this.canvasContext.lineTo() x n
	// 	// this.canvasContext.stroke();
	// }

	public onClickCanvas(event: { offsetX: number; offsetY: number }): void {
		console.log(
			`(offsetX, offsetY) : (${event.offsetX}, ${event.offsetY})`
		);
	}

	protected clearCanvas(): void {
		if (this.canvasContext) {
			this.canvasContext.fillStyle = Colours.black;
			this.canvasContext.beginPath();
			this.canvasContext.fillRect(
				0,
				0,
				this.canvasWidth,
				this.canvasHeight
			);
			// For an unfilled rectangle, replace fillRect() with rect(). Then fillStyle does not need to be set.
			this.canvasContext.stroke(); // Actually draw the shapes that are described above.
		}

		// console.log(
		// 	`Canvas width and height: ${this.canvasWidth} x ${this.canvasHeight}`
		// );
	}

	protected setChartMinMaxYValues(...data: number[][]): boolean {
		const fnSliceAndFilter = (array: number[]) =>
			array
				.slice(-this.canvasWidthInDataPoints)
				.filter((n) => !Number.isNaN(n));

		const maxHigh = Math.max(
			...data.map((data2) => Math.max(...fnSliceAndFilter(data2)))
		);
		const minLow = Math.min(
			...data.map((data2) => Math.min(...fnSliceAndFilter(data2)))
		);

		if (maxHigh - minLow < 0.000005) {
			this.priceAtCanvasBottom = NaN;
			this.priceAtCanvasTop = NaN;
			return false;
		}

		// Create a 10% margin at each of the top and bottom:
		const yPriceMargin = (maxHigh - minLow) * 0.1;

		if (this.autoSetMinY) {
			this.priceAtCanvasBottom = minLow - yPriceMargin;
		}

		if (this.autoSetMaxY) {
			this.priceAtCanvasTop = maxHigh + yPriceMargin;
		}

		return true;
	}

	protected beginDrawing(...data: number[][]): boolean {
		this.clearCanvas();

		return this.setChartMinMaxYValues(...data);
	}

	// public endDrawing(): void {
	// 	this.canvasContext.stroke();
	// }

	private mapPriceToYCoord(price: number): number {
		return (
			this.canvasHeight -
			1 -
			Math.round(
				((price - this.priceAtCanvasBottom) * this.canvasHeight) /
					(this.priceAtCanvasTop - this.priceAtCanvasBottom)
			)
		);
	}

	protected drawLine(data: number[], lineColour: string): void {
		data = data.slice(-this.canvasWidthInDataPoints);

		let x =
			(this.canvasWidthInDataPoints - data.length) * widthPerDataPoint +
			Math.floor(widthPerDataPoint / 2);
		let lineStarted = false;

		this.canvasContext.strokeStyle = lineColour;
		// lineCap, lineJoin, lineWidth, miterLimit
		this.canvasContext.lineWidth = 2; // ?
		this.canvasContext.beginPath();

		for (const datum of data) {
			if (Number.isNaN(datum)) {
				lineStarted = false;
			} else {
				const y = this.mapPriceToYCoord(datum);

				if (lineStarted) {
					this.canvasContext.lineTo(x, y);
				} else {
					this.canvasContext.moveTo(x, y);
					lineStarted = true;
				}
			}

			x += widthPerDataPoint;
		}

		this.canvasContext.stroke();
	}

	protected drawHorizontalLine(y: number, lineColour: string): void {
		y = this.mapPriceToYCoord(y);

		this.canvasContext.strokeStyle = lineColour;
		this.canvasContext.lineWidth = 2; // ?
		this.canvasContext.beginPath();
		this.canvasContext.moveTo(0, y);
		this.canvasContext.lineTo(this.canvasWidth, y);
		this.canvasContext.stroke();
	}

	protected drawBar(
		x: number,
		y: number,
		barOutlineColour: string,
		barFillColour: string
	): void {
		y = this.mapPriceToYCoord(y);
		this.canvasContext.strokeStyle = barOutlineColour;
		this.canvasContext.fillStyle = barFillColour;
		this.canvasContext.lineWidth = 1; // ?
		this.canvasContext.beginPath();
		this.canvasContext.fillRect(
			x + barXMarginWidth,
			y,
			widthPerDataPoint - 2 * barXMarginWidth,
			this.canvasHeight - y
		);
		this.canvasContext.rect(
			x + barXMarginWidth,
			y,
			widthPerDataPoint - 2 * barXMarginWidth,
			this.canvasHeight - y
		);
		this.canvasContext.stroke();
	}

	protected drawBars(
		data: number[],
		barOutlineColour: string,
		barFillColour: string
	): void {
		data = data.slice(-this.canvasWidthInDataPoints);

		let x =
			(this.canvasWidthInDataPoints - data.length) * widthPerDataPoint;

		for (const datum of data) {
			if (!Number.isNaN(datum)) {
				this.drawBar(x, datum, barOutlineColour, barFillColour);
			}

			x += widthPerDataPoint;
		}
	}

	protected drawDot(
		x: number,
		y: number,
		dotOutlineColour: string,
		dotFillColour: string
	): void {
		// widthPerDot

		y = this.mapPriceToYCoord(y);

		const dx1 = Math.floor((widthPerDataPoint - widthPerDot) / 2);
		const dy1 = -Math.floor(widthPerDot / 2);

		this.canvasContext.strokeStyle = dotOutlineColour;
		this.canvasContext.fillStyle = dotFillColour;
		this.canvasContext.lineWidth = 1; // ?
		this.canvasContext.beginPath();
		this.canvasContext.fillRect(
			x + dx1,
			y + dy1,
			widthPerDot,
			widthPerDot
		);
		this.canvasContext.rect(x + dx1, y + dy1, widthPerDot, widthPerDot);
		this.canvasContext.stroke();
	}

	public drawDots(data: number[], pointsColour: string): void {
		data = data.slice(-this.canvasWidthInDataPoints);

		let x =
			(this.canvasWidthInDataPoints - data.length) * widthPerDataPoint;

		for (const datum of data) {
			if (!Number.isNaN(datum)) {
				this.drawDot(x, datum, pointsColour, pointsColour);
			}

			x += widthPerDataPoint;
		}
	}

	protected drawPriceVsTimeLine(
		times: number[],
		priceResults: number[],
		timeResults: number[],
		lineColour: string
	): void {
		times = times.slice(-this.canvasWidthInDataPoints);

		if (times.length === 0) {
			return;
		}

		timeResults = timeResults.filter((t) => t >= times[0]);
		priceResults = priceResults.slice(-timeResults.length);

		let x =
			(this.canvasWidthInDataPoints - times.length) *
				widthPerDataPoint +
			Math.floor(widthPerDataPoint / 2);
		let lineStarted = false;
		let i = 0;

		this.canvasContext.strokeStyle = lineColour;
		this.canvasContext.lineWidth = 2; // ?
		this.canvasContext.beginPath();

		for (const time of times) {
			if (Number.isNaN(time)) {
				lineStarted = false;
			} else if (i < timeResults.length && time >= timeResults[i]) {
				const y = this.mapPriceToYCoord(priceResults[i]);

				i++;

				if (lineStarted) {
					this.canvasContext.lineTo(x, y);
				} else {
					this.canvasContext.moveTo(x, y);
					lineStarted = true;
				}
			}

			x += widthPerDataPoint;
		}

		this.canvasContext.stroke();
	}

	private drawHorizontalBar(
		y: number,
		barWidth: number,
		barHeight: number,
		barOutlineColour: string,
		barFillColour: string
	): void {
		// y = this.mapPriceToYCoord(y);
		this.canvasContext.strokeStyle = barOutlineColour;
		this.canvasContext.fillStyle = barFillColour;
		this.canvasContext.lineWidth = 1; // ?
		this.canvasContext.beginPath();
		this.canvasContext.fillRect(
			0,
			y + barYMarginHeight,
			barWidth,
			barHeight - 2 * barYMarginHeight
		);
		this.canvasContext.rect(
			0,
			y + barYMarginHeight,
			barWidth,
			barHeight - 2 * barYMarginHeight
		);
		this.canvasContext.stroke();
	}
}
