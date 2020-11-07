// angular-electron/e2e/main.e2e.ts

import { expect } from 'chai';
import { SpectronClient } from 'spectron';

import commonSetup from './common-setup';

describe('angular-electron App', () => {
	commonSetup.apply(this);

	let client: SpectronClient;
	let originalTimeout: number;

	beforeEach(function () {
		console.log('BEGIN beforeEach');
		client = this.app.client;
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		console.log('END beforeEach');
	});

	afterEach(() => {
		console.log('BEGIN afterEach');
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
		console.log('END afterEach');
	});

	it('Creates initial app window', async () => {
		console.log('BEGIN test: Creates initial app window');
		const count = await client.getWindowCount();
		// expect(count).toEqual(1);
		expect(count).to.equal(1);
		console.log('END test: Creates initial app window');
	});

	// it('should display message saying App works !', async () => {
	// 	const elem = await client.$('app-home h1');
	// 	const text = await elem.getText();
	// 	expect(text).toEqual('App works !');
	// });
});
