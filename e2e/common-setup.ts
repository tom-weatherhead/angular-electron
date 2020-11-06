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

		await this.app.start();
	});

	afterEach(async function () {
		if (this.app && this.app.isRunning()) {
			await this.app.stop();
		}
	});
}
