// angular-electron/e2e/main.e2e.ts

import * as path from 'path';
import * as electron from 'electron';
import { Application, SpectronClient } from 'spectron';
import { expect } from 'chai';

// import commonSetup from './common-setup';

describe('Application launch', function () {
	// commonSetup.apply(this);

	let client: SpectronClient;
	let originalTimeout: number;

	beforeEach(async function (done) {
		const electronPath = electron.toString();

		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;

		this.app = new Application({
			// Your electron path can be any binary
			// i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
			// But for the sake of the example we fetch it from our node_modules.
			path: electronPath,

			// Assuming you have the following directory structure

			//  |__ my project
			//     |__ ...
			//     |__ main.js
			//     |__ package.json
			//     |__ index.html
			//     |__ ...
			//     |__ test
			//        |__ spec.js  <- You are here! ~ Well you should be.

			// The following line tells spectron to look and use the main.js file
			// and the package.json located 1 level above.
			args: [path.join(__dirname, '..')]
		});

		try {
			await this.app.start();
		} catch (error) {
			console.error('app.start error:', typeof error, error);
			throw error;
		}

		client = this.app.client;
		done();
	});

	afterEach(async function (done) {
		if (this.app && this.app.isRunning()) {
			await this.app.stop();
		}

		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;

		done();
	});

	it('shows an initial window', async function (done) {
		// const count = await this.app.client.getWindowCount();
		const count = await client.getWindowCount();

		expect(count).to.equal(1);
		// Please note that getWindowCount() will return 2 if `dev tools` are opened.
		// assert.equal(count, 2)

		done();
	});

	it('should display a sidebar-heading that reads: angular-electron', async function (done) {
		// const elem = await this.app.client.$('div.sidebar-heading');
		const elem = await client.$('div.sidebar-heading');
		const text = await elem.getText();

		expect(text).to.equal('angular-electron');

		done();
	});

	it('should display an h1 header in the dashboard-controls-wrapper div that reads: Dashboard Component', async function (done) {
		// const elem = await this.app.client.$(
		// 	'div#dashboard-controls-wrapper h1'
		// );
		const elem = await client.$('div#dashboard-controls-wrapper h1');
		const text = await elem.getText();

		expect(text).to.equal('Dashboard Component');

		done();
	});
});
