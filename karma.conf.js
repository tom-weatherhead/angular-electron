// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = (config) => {
	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-jasmine'),
			// require('karma-chrome-launcher'),
			require('karma-electron'),
			require('karma-jasmine-html-reporter'),
			require('karma-coverage-istanbul-reporter'),
			require('@angular-devkit/build-angular/plugins/karma')
		],
		client: {
			clearContext: false, // leave Jasmine Spec Runner output visible in browser
			// DEV: `useIframe: false` is for launching a new window instead of using an iframe
			//   In Electron, iframes don't get `nodeIntegration` priveleges yet windows do
			useIframe: false
		},
		coverageIstanbulReporter: {
			dir: require('path').join(__dirname, './coverage'),
			reports: ['html', 'lcovonly', 'text-summary'],
			fixWebpackSourcePaths: true
		},
		reporters: ['progress', 'kjhtml'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,

		// **** Old config ****
		// autoWatch: true,
		// // browsers: ['Chrome'],
		// // browsers: ['ChromeHeadless'],
		// browsers: ['Electron'],
		// singleRun: false,
		// restartOnFileChange: true,
		// // If you would like Node.js integration support (e.g. `require`)
		// //   then, you must include this in `preprocessors` and `client`
		// // DEV: preprocessors is for backfilling `__filename` and local `require` paths
		// preprocessors: {
		// 	'**/*.js': ['electron']
		// }

		autoWatch: false,

		// **** New config, stolen from angular-electron ****
		browsers: ['AngularElectron'],
		customLaunchers: {
			AngularElectron: {
				base: 'Electron',
				flags: ['--remote-debugging-port=9222'],
				browserWindowOptions: {
					webPreferences: {
						nodeIntegration: true,
						nodeIntegrationInSubFrames: true,
						allowRunningInsecureContent: false, // true,
						contextIsolation: false, // false if you want to run e2e test with Spectron
						enableRemoteModule: true // , // true if you want to run e2e tests with Spectron or use remote module in renderer context (ie. Angular)
						// worldSafeExecuteJavaScript: true
					} // ,
					// worldSafeExecuteJavaScript: true
				}
			}
		}
	});
};
