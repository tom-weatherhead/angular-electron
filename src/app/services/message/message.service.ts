// angular-electron/src/app/services/message.service.ts

import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class MessageService {
	// The receiver does this once: messageService.setAppBannerMessage.subscribe(...);
	// Any sender does this zero or more times: messageService.setAppBannerMessage.next(strMessage);
	private readonly setAppBannerMessage = new Subject<string>();

	// constructor() {}

	public sendSetAppBannerMessage(
		appBannerMessage: string,
		isErrorMessage?: boolean
	): void {
		if (isErrorMessage) {
			appBannerMessage = 'Error: ' + appBannerMessage;
		}

		this.setAppBannerMessage.next(appBannerMessage);
	}

	public receiveSetAppBannerMessage(
		appBannerMessageHandler: (
			appBannerMessage: string,
			isErrorMessage?: boolean
		) => void
	): void {
		this.setAppBannerMessage.subscribe(appBannerMessageHandler);
	}

	public hideAppBanner(): void {
		this.sendSetAppBannerMessage('');
	}
}
