// angular-electron/src/app/services/logger/logger.service.spec.ts

import { TestBed } from '@angular/core/testing';

import { ElectronService } from '../electron/electron.service';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
	let service: LoggerService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			// imports: [
			// 	FormsModule, // For e.g. NgModel
			// 	HttpClientModule
			// ],
			// declarations: [
			// 	DashboardComponent,
			// 	GenericChartCanvasComponent,
			// 	IndicatorsChartCanvasComponent,
			// 	PriceAndOverlaysChartCanvasComponent
			// ],
			providers: [
				// {
				// 	provide: DataFeedProviderFactoryService,
				// 	useValue: createMockDFPFS(expectedSymbols)
				// },
				ElectronService
			]
		});
		service = TestBed.inject(LoggerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
