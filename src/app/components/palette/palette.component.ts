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

// import { Colours } from 'thaw-colour';
import { fourBitPalette, fourBitPaletteColourNames } from 'thaw-colour';

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

// **** BEGIN: Move this to thaw-colour ****

// This array enforces the order of the colours in the palette.

// const fourBitPaletteColourNames = [
// 	'Black',
// 	'Maroon',
// 	'Green',
// 	'Olive',
// 	'Navy',
// 	'Purple',
// 	'Teal',
// 	'Silver',
// 	'Grey',
// 	'Red',
// 	'Lime',
// 	'Yellow',
// 	'Blue',
// 	'Fuchsia',
// 	'Aqua',
// 	'White'
// ];

// const fourBitPalette: Record<string, string> = {
// 	Black: '#000000',
// 	Maroon: '#800000',
// 	Green: '#008000',
// 	Olive: '#808000',
// 	Navy: '#000080',
// 	Purple: '#800080',
// 	Teal: '#008080',
// 	Silver: '#c0c0c0',
// 	Grey: '#808080',
// 	Red: '#ff0000',
// 	Lime: '#00ff00',
// 	Yellow: '#ffff00',
// 	Blue: '#0000ff',
// 	Fuchsia: '#ff00ff',
// 	Aqua: '#00ffff',
// 	White: '#ffffff'
// };

// **** END: Move this to thaw-colour ****

// Draw the above colours on a canvas in 16 NxN squares,
// where N is e.g. 16

const paletteColourSwatchWidth = 32;
const paletteColourSwatchHeight = paletteColourSwatchWidth;

// TODO: When a palette colour is clicked on, use an RxJS Subject to notify
// any subscribers of the clicked-on colour.

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

	// ngOnInit(): void {
	// 	// this.selectedColour = new Subject<string>();
	// }

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

		// const selectedColourAsString = fourBitPalette[this.selectedColourName];

		// console.log(
		// 	'PaletteComponent.onClickCanvas() : selectedColour is',
		// 	this.selectedColourName,
		// 	selectedColourAsString
		// );

		// this.selectedColour.next(selectedColourAsString);
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
