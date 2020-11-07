// angular-electron/e2e/common-setup.ts

import { platform } from 'os';

import { join } from 'path';

import { Application } from 'spectron';

// const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
// import * as electron from 'electron';

function getElectronPath(): string {
	let str: string;

	switch (platform()) {
		case 'darwin':
			str = 'Electron.app/Contents/MacOS/Electron';
			break;

		case 'linux':
			str = 'electron';
			break;

		// case 'win32':
		// 	str = '';
		// 	break;

		default:
			throw new Error(
				`e2e: getElectronPath() : Unexpected platform '${platform()}'`
			);
	}

	return join(__dirname, '../node_modules/electron/dist', str);
}

export default function setup(): void {
	beforeEach(async function () {
		console.log('BEGIN common-setup beforeEach');
		if (platform() === 'linux') {
			this.app = new Application({
				// path: join(
				// 	__dirname,
				// 	'../release/angular-electron-0.0.3.AppImage'
				// ),
				path: '/home/travis/build/tom-weatherhead/angular-electron/release/angular-electron-0.0.3.AppImage',
				// args: [join(__dirname, '..')],
				args: ['/home/travis/build/tom-weatherhead/angular-electron'],
				webdriverOptions: {}
			});
		} else {
			this.app = new Application({
				// Your electron path can be any binary
				// i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
				// But for the sake of the example we fetch it from our node_modules.
				path: getElectronPath(),

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
				args: [join(__dirname, '..')],
				webdriverOptions: {}
			});
		}

		console.log('this.app is', typeof this.app, this.app);

		console.log('Starting the app...');

		try {
			await this.app.start();
		} catch (error) {
			console.error('app.start error:', typeof error, error);
			throw error;
		}

		console.log('The app has started.');

		if (this.app) {
			console.log(
				'this.app.client is',
				typeof this.app.client,
				this.app.client
			);
		}

		console.log('END common-setup beforeEach');
	});

	afterEach(async function () {
		console.log('BEGIN common-setup afterEach');
		if (this.app && this.app.isRunning()) {
			await this.app.stop();
		}
		console.log('END common-setup afterEach');
	});
}
