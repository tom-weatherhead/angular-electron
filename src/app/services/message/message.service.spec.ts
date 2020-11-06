// angular-electron/src/app/services/message.service.spec.ts

import { inject, TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';

describe('MessageService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created by injection', inject(
		[MessageService],
		(service: MessageService) => {
			expect(service).toBeTruthy();
		}
	));

	it('should be created by TestBed.get()', () => {
		const service: MessageService = TestBed.inject(MessageService);

		expect(service).toBeTruthy();
	});
});
