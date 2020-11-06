// angular-electron/src/app/services/electron.service.spec.ts

import { inject, TestBed } from '@angular/core/testing';

import { ElectronService } from './electron.service';

describe('ElectronService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			// imports: [
			// ],
			// providers: [
			// 	ElectronService
			// ]
		});
	});

	it('should be created by injection', inject(
		[ElectronService],
		(service: ElectronService) => {
			expect(service).toBeTruthy();
		}
	));

	it('should be created by TestBed.get()', () => {
		const service: ElectronService = TestBed.inject(ElectronService);

		expect(service).toBeTruthy();
	});
});
