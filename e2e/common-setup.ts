// angular-electron/e2e/common-setup.ts

// import { platform } from 'os';

import { join } from 'path';

import { Application } from 'spectron';

// const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
import * as electron from 'electron';

/*
new Application(options)

Create a new application with the following options:

    path - Required. String path to the Electron application executable to launch. Note: If you want to invoke electron directly with your app's main script then you should specify path as electron via electron-prebuilt and specify your app's main script path as the first argument in the args array.
    args - Array of arguments to pass to the Electron application.
    chromeDriverArgs - Array of arguments to pass to ChromeDriver. See here for details on the Chrome arguments.
    cwd- String path to the working directory to use for the launched application. Defaults to process.cwd().
    env - Object of additional environment variables to set in the launched application.
    host - String host name of the launched chromedriver process. Defaults to 'localhost'.
    port - Number port of the launched chromedriver process. Defaults to 9515.
    nodePath - String path to a node executable to launch ChromeDriver with. Defaults to process.execPath.
    connectionRetryCount - Number of retry attempts to make when connecting to ChromeDriver. Defaults to 10 attempts.
    connectionRetryTimeout - Number in milliseconds to wait for connections to ChromeDriver to be made. Defaults to 30000 milliseconds.
    quitTimeout - Number in milliseconds to wait for application quitting. Defaults to 1000 milliseconds.
    requireName - Custom property name to use when requiring modules. Defaults to require. This should only be used if your application deletes the main window.require function and assigns it to another property name on window.
    startTimeout - Number in milliseconds to wait for ChromeDriver to start. Defaults to 5000 milliseconds.
    waitTimeout - Number in milliseconds to wait for calls like waitUntilTextExists and waitUntilWindowLoaded to complete. Defaults to 5000 milliseconds.
    debuggerAddress - String address of a Chrome debugger server to connect to.
    chromeDriverLogPath - String path to file to store ChromeDriver logs in. Setting this option enables --verbose logging when starting ChromeDriver.
    webdriverLogPath - String path to a directory where Webdriver will write logs to. Setting this option enables verbose logging from Webdriver.
    webdriverOptions - Object of additional options for Webdriver

Node Integration

The Electron helpers provided by Spectron require accessing the core Electron APIs in the renderer processes of your application. So, either your Electron application has nodeIntegration set to true or you'll need to expose a require window global to Spectron so it can access the core Electron APIs.

You can do this by adding a preload script that does the following:

if (process.env.NODE_ENV === 'test') {
  window.electronRequire = require
}

Then create the Spectron Application with the requireName option set to 'electronRequire' and then runs your tests via NODE_ENV=test npm test.

Note: This is only required if your tests are accessing any Electron APIs. You don't need to do this if you are only accessing the helpers on the client property which do not require Node integration.
 */

export default function setup(): void {
	beforeEach(async function () {
		// console.log('BEGIN common-setup beforeEach');
		const electronPath = electron.toString();
		// console.log('electronPath is', typeof electronPath, electronPath);
		this.app = new Application({
			// Your electron path can be any binary
			// i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
			// But for the sake of the example we fetch it from our node_modules.
			// path: getElectronPath(),
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
			args: [join(__dirname, '..')],
			webdriverOptions: {}
		});
		// }

		// console.log('this.app is', typeof this.app, this.app);

		// console.log('Starting the app...');

		try {
			await this.app.start();
		} catch (error) {
			console.error('app.start error:', typeof error, error);
			throw error;
		}

		// console.log('The app has started.');

		// if (this.app) {
		// 	console.log(
		// 		'this.app.client is',
		// 		typeof this.app.client,
		// 		this.app.client
		// 	);
		// }

		// console.log('END common-setup beforeEach');
	});

	afterEach(async function () {
		// console.log('BEGIN common-setup afterEach');
		if (this.app && this.app.isRunning()) {
			await this.app.stop();
		}
		// console.log('END common-setup afterEach');
	});
}
