import { expect } from 'chai';
import { SpectronClient } from 'spectron';

import commonSetup from './common-setup';

describe('angular-electron App', () => {
	commonSetup.apply(this);

	let client: SpectronClient;
	let originalTimeout: number;

	beforeEach(function () {
		client = this.app.client;
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
	});

	afterEach(() => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});

	it('Creates initial app window', async () => {
		const count = await client.getWindowCount();
		// expect(count).toEqual(1);
		expect(count).to.equal(1);
	});

	// it('should display message saying App works !', async () => {
	// 	const elem = await client.$('app-home h1');
	// 	const text = await elem.getText();
	// 	expect(text).toEqual('App works !');
	// });
});
