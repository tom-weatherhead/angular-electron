// angular-electron/src/app/services/configuration/configuration.service.spec.ts

import { TestBed } from '@angular/core/testing';

import { ElectronService } from '../electron/electron.service';

import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
	let service: ConfigurationService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ElectronService]
		});
		service = TestBed.inject(ConfigurationService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
