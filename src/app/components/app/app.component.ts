// github:tom-weatherhead/angular-electron/src/app/components/app/app.component.ts

import { Component, OnInit } from '@angular/core';

import { MessageService } from '../../services/message/message.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	toggleStatus = true;

	isMessageBarVisible = false;
	messageBarText = ''; // 'Message Bar';
	messageBarCssClass = 'centre'; // 'centre messageBarGreen';

	constructor(private messageService: MessageService) {}

	ngOnInit(): void {
		this.messageService.receiveSetAppBannerMessage(
			(appBannerMessage: string, isErrorMessage?: boolean): void => {
				if (!appBannerMessage) {
					this.isMessageBarVisible = false;
				} else {
					let statusColour: string;

					switch (isErrorMessage) {
						case true:
							statusColour = 'Red';
							break;

						case false:
							statusColour = 'Green';
							break;

						default:
							statusColour = 'Yellow';
							break;
					}

					this.messageBarText = appBannerMessage;
					this.messageBarCssClass = `centre messageBar${statusColour}`;
					this.isMessageBarVisible = true;
				}
			}
		);
	}

	public menuToggle(): void {
		this.toggleStatus = !this.toggleStatus;

		// Test:

		// if (this.isMessageBarVisible) {
		// 	// this.messageService.hideAppBanner(); ?
		// 	this.messageService.sendSetAppBannerMessage('');
		// } else {
		// 	this.messageService.sendSetAppBannerMessage('Yay', true);
		// 	setTimeout(
		// 		() => this.messageService.sendSetAppBannerMessage(''),
		// 		5000
		// 	);
		// }
	}
}
