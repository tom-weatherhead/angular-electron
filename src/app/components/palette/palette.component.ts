// angular-electron/src/app/components/palette/palette.component.ts

import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnInit,
	ViewChild
} from '@angular/core';

import { Observable, /* of, */ Subject } from 'rxjs';

// import { switchMap, takeUntil } from 'rxjs/operators';

// import { Colours } from 'thaw-colour';

// 16-color palette
// From https://thestarman.pcministry.com/RGB/16WinColorT.html :

// Black:	000000
// Maroon:	800000
// Green:	008000
// Olive:	808000
// Navy:	000080
// Purple:	800080
// Teal:	008080
// Silver:	C0C0C0
// Gray:	808080
// Red::	FF0000
// Lime:	00FF00 (maximum green)
// Yellow:	FFFF00
// Blue:	0000FF
// Fuchsia:	FF00FF (magenta)
// Aqua::	00FFFF (cyan)
// White:	FFFFFF

// Draw the above colours on a canvas in 16 NxN squares,
// where N is e.g. 16

const fourBitPaletteColours = [
	// Colours.black,
	// Colours.,
	// Colours.,
	// Colours.,
	// Colours.,
	// Colours.,
	// Colours.,
	// Colours.,
	// Colours.,
	// Colours.red,
	// Colours.lime,
	// Colours.yellow,
	// Colours.blue,
	// Colours.magenta,
	// Colours.cyan,
	// Colours.white
	'#000000',
	'#800000',
	'#008000',
	'#808000',
	'#000080',
	'#800080',
	'#008080',
	'#c0c0c0',
	'#808080',
	'#ff0000',
	'#00ff00',
	'#ffff00',
	'#0000ff',
	'#ff00ff',
	'#00ffff',
	'#ffffff'
];

const paletteColourSwatchWidth = 32;
const paletteColourSwatchHeight = 32;

// TODO: When a palette colour is clicked on, use an RxJS Subject to notify
// any subscribers of the clicked-on colour.

@Component({
	selector: 'app-palette',
	templateUrl: './palette.component.html' // ,
	// styleUrls: ['./palette.component.scss']
})
export class PaletteComponent implements AfterViewInit, OnInit {
	@ViewChild('canvas', { static: true })
	canvas: ElementRef<HTMLCanvasElement>;

	public canvasContext: CanvasRenderingContext2D; // View

	private readonly canvasWidth =
		paletteColourSwatchWidth * fourBitPaletteColours.length;
	private readonly canvasHeight = paletteColourSwatchHeight;

	private selectedColour: Subject<string>;

	constructor(protected changeDetectorRef: ChangeDetectorRef) {}

	ngOnInit(): void {
		this.selectedColour = new Subject<string>();
	}

	ngAfterViewInit(): void {
		this.canvasContext = this.canvas.nativeElement.getContext('2d');
		// this.clearCanvas();
		this.drawPalette();
	}

	public get selectedColourObservable(): Observable<string> {
		return this.selectedColour;
	}

	public onClickCanvas(event: { offsetX: number; offsetY: number }): void {
		// console.log(
		// 	'PaletteComponent.onClickCanvas() : event is',
		// 	typeof event,
		// 	event
		// );
		// console.log(
		// 	`(offsetX, offsetY) : (${event.offsetX}, ${event.offsetY})`
		// );

		const selectedColourAsString =
			fourBitPaletteColours[
				Math.floor(event.offsetX / paletteColourSwatchWidth)
			];

		// console.log('selectedColour:', selectedColour);

		// subject.next(selectedColour);

		this.selectedColour.next(selectedColourAsString);
	}

	// protected clearCanvas(): void {
	// 	if (this.canvasContext) {
	// 		this.canvasContext.fillStyle = Colours.black;
	// 		this.canvasContext.beginPath();
	// 		this.canvasContext.fillRect(
	// 			0,
	// 			0,
	// 			this.canvasWidth,
	// 			this.canvasHeight
	// 		);
	// 		// For an unfilled rectangle, replace fillRect() with rect(). Then fillStyle does not need to be set.
	// 		this.canvasContext.stroke(); // Actually draw the shapes that are described above.
	// 	}

	// 	// console.log(
	// 	// 	`Canvas width and height: ${this.canvasWidth} x ${this.canvasHeight}`
	// 	// );
	// }

	private drawPalette(): void {
		for (let i = 0; i < fourBitPaletteColours.length; i++) {
			this.canvasContext.fillStyle = fourBitPaletteColours[i];
			this.canvasContext.fillRect(
				i * paletteColourSwatchWidth,
				0,
				paletteColourSwatchWidth,
				this.canvasHeight
			);
		}
	}
}
