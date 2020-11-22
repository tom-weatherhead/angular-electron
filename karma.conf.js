// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = (config) => {
	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('@angular-devkit/build-angular/plugins/karma'),
			require('karma-coverage'),
			require('karma-electron'),
			require('karma-jasmine')
		],
		client: {
			clearContext: false, // leave Jasmine Spec Runner output visible in browser
			// DEV: `useIframe: false` is for launching a new window instead of using an iframe
			//   In Electron, iframes don't get `nodeIntegration` priveleges yet windows do
			useIframe: false
		},
		preprocessors: {
			'src/**/*.ts': ['coverage', 'electron']
		},
		coverageReporter: {
			// specify a common output directory
			dir: 'coverage',
			reporters: [
				// reporters not supporting the `file` property
				{ type: 'html', subdir: 'report-html' },
				// { type: 'lcov', subdir: 'report-lcov' },
				// reporters supporting the `file` property, use `subdir` to directly
				// output them in the `dir` directory
				// { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
				{
					type: 'lcovonly',
					subdir: '.',
					file: 'lcov.info'
				},
				// { type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
				// { type: 'text', subdir: '.', file: 'text.txt' },
				{
					type: 'text-summary',
					subdir: '.',
					file: 'text-summary.txt'
				}
			]
		},
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
