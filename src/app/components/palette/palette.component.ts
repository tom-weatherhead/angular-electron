// angular-electron/src/app/components/palette/palette.component.ts

import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	// OnInit,
	ViewChild
} from '@angular/core';

import { Observable, /* of, */ Subject } from 'rxjs';

// import { switchMap, takeUntil } from 'rxjs/operators';

import { fourBitPalette, fourBitPaletteColourNames } from 'thaw-colour';

// Draw the above colours on a canvas in 16 NxN squares,
// where N is e.g. 32

const paletteColourSwatchWidth = 32;
const paletteColourSwatchHeight = paletteColourSwatchWidth;

@Component({
	selector: 'app-palette',
	templateUrl: './palette.component.html' // ,
	// styleUrls: ['./palette.component.scss']
})
export class PaletteComponent implements AfterViewInit {
	@ViewChild('canvas', { static: true })
	canvas: ElementRef<HTMLCanvasElement>;

	public canvasContext: CanvasRenderingContext2D | null = null; // View

	public selectedColourName = '';

	private readonly canvasWidth =
		paletteColourSwatchWidth * fourBitPaletteColourNames.length;
	private readonly canvasHeight = paletteColourSwatchHeight;

	private readonly selectedColour = new Subject<string>();

	constructor(protected changeDetectorRef: ChangeDetectorRef) {}

	ngAfterViewInit(): void {
		this.canvasContext = this.canvas.nativeElement.getContext('2d');
		this.drawPalette();
	}

	public get selectedColourObservable(): Observable<string> {
		return this.selectedColour;
	}

	public onClickCanvas(event: { offsetX: number }): void {
		const i = Math.floor(event.offsetX / paletteColourSwatchWidth);

		this.selectedColourName = fourBitPaletteColourNames[i];
		this.selectedColour.next(fourBitPalette[this.selectedColourName]);
	}

	private drawPalette(): void {
		if (!this.canvasContext) {
			return;
		}

		for (let i = 0; i < fourBitPaletteColourNames.length; i++) {
			this.canvasContext.fillStyle =
				fourBitPalette[fourBitPaletteColourNames[i]];
			this.canvasContext.fillRect(
				i * paletteColourSwatchWidth,
				0,
				paletteColourSwatchWidth,
				this.canvasHeight
			);
		}
	}
}
