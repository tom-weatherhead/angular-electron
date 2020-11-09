// angular-electron/e2e/main.e2e.ts

import { expect } from 'chai';
// import { SpectronClient } from 'spectron';

// // import * as electron from 'electron';

// import commonSetup from './common-setup';

// describe('angular-electron App', () => {
// 	commonSetup.apply(this);

// 	let client: SpectronClient;
// 	let originalTimeout: number;

// 	beforeEach(function () {
// 		console.log('BEGIN beforeEach');
// 		client = this.app.client;
// 		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
// 		console.log('END beforeEach');
// 	});

// 	afterEach(() => {
// 		console.log('BEGIN afterEach');
// 		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
// 		console.log('END afterEach');
// 	});

// 	it('Creates initial app window', async () => {
// 		console.log('BEGIN test: Creates initial app window');
// 		// console.log('electron is', typeof electron, electron);
// 		const count = await client.getWindowCount();
// 		// expect(count).toEqual(1);
// 		expect(count).to.equal(1);
// 		console.log('END test: Creates initial app window');
// 	});

// 	// it('should display message saying App works !', async () => {
// 	// 	const elem = await client.$('app-home h1');
// 	// 	const text = await elem.getText();
// 	// 	expect(text).toEqual('App works !');
// 	// });
// });

// const Application = require('spectron').Application;
// const assert = require('assert');
// const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
// const path = require('path');

import { Application } from 'spectron';

import * as electron from 'electron';
import * as path from 'path';

describe('Application launch', function () {
	let originalTimeout: number;

	// this.timeout(10000);

	beforeAll(async function (done) {
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
			args: [
				path.join(__dirname, '..')
			] /* ,
			chromeDriverArgs: [
				'--no-sandbox',
				'--whitelisted-ips=',
				'--disable-dev-shm-usage'
			] */
		});

		// await this.app.start();

		try {
			await this.app.start();
		} catch (error) {
			console.error('app.start error:', typeof error, error);
			throw error;
		}

		done();
	});

	afterAll(async function (done) {
		if (this.app && this.app.isRunning()) {
			await this.app.stop();
		}

		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;

		done();
	});

	it('shows an initial window', async function (done) {
		// jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;

		const count = await this.app.client.getWindowCount();

		expect(count).to.equal(1);
		// Please note that getWindowCount() will return 2 if `dev tools` are opened.
		// assert.equal(count, 2)

		done();
	});

	it('should display a sidebar-heading that reads: angular-electron', async function (done) {
		// jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;

		const elem = await this.app.client.$('div.sidebar-heading');
		const text = await elem.getText();

		expect(text).to.equal('angular-electron');

		done();
	});

	it('should display an h1 header in the dashboard-controls-wrapper div that reads: Dashboard Component', async function (done) {
		// jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;

		const elem = await this.app.client.$('div#dashboard-controls-wrapper h1');
		const text = await elem.getText();

		expect(text).to.equal('Dashboard Component');

		done();
	});
});
