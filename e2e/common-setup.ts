// const Application = require('spectron').Application;

import { Application } from 'spectron';

// const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
// import * as electron from 'electron';

// const path = require('path');
import * as path from 'path';

export default function setup(): void {
	beforeEach(async function () {
		this.app = new Application({
			// Your electron path can be any binary
			// i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
			// But for the sake of the example we fetch it from our node_modules.
			path: path.join(
				__dirname,
				'../node_modules/electron/dist/Electron.app/Contents/MacOS/Electron' // macOS
				// '../node_modules/electron/dist/electron' // Linux
			),

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
			args: [path.join(__dirname, '..')],
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
