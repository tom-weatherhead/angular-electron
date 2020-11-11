// angular-electron/e2e/main.e2e.ts

import { join } from 'path';
import { Application } from 'spectron';
import * as electron from 'electron';

import { expect } from 'chai';
// import * as chai from 'chai';
// import * as chaiAsPromised from 'chai-as-promised';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
// const chaiAsPromised = require('chai-as-promised');

// import commonSetup from './common-setup';

// console.log('**** chaiAsPromised is', typeof chaiAsPromised, chaiAsPromised);

// chai.should(); // Use chai's 'should' style instead of the expect or the assert style
// chai.use(chaiAsPromised);

describe('Application launch', function () {
	this.timeout(10000);
	// this.chaiAsPromised = chaiAsPromised;
	// commonSetup.apply(this);

	beforeEach(function () {
		const electronPath = electron.toString();

		this.app = new Application({
			path: electronPath,
			args: [join(__dirname, '..')],
			webdriverOptions: {},

			// From http://www.matthiassommer.it/programming/web/integration-e2e-test-electron-mocha-spectron-chai/ :

			env: {
				ELECTRON_ENABLE_LOGGING: true,
				ELECTRON_ENABLE_STACK_DUMPING: true,
				NODE_ENV: 'development'
			},
			startTimeout: 20000,
			waitTimeout: 20000
		});

		// chaiAsPromised.transferPromiseness = this.app.transferPromiseness;
		// chaiAsPromised.transferPromiseness = function (assertion, promise) {
		// 	assertion.then = promise.then.bind(promise); // this is all you get by default
		// 	assertion.finally = promise.finally.bind(promise);
		// 	assertion.done = promise.done.bind(promise);
		// };

		return this.app.start(); // Return a Promise

		// await this.app.start();

		// done();
	});

	// beforeEach(function () {
	// 	chaiAsPromised.transferPromiseness = this.app.transferPromiseness;
	// });

	afterEach(function () {
		if (this.app && this.app.isRunning()) {
			return this.app.stop();
			// await this.app.stop();
		}

		// done();
		// return Promise.resolve(true);
	});

	it('shows an initial window', async function () {
		const count = await this.app.client.getWindowCount();

		expect(count).to.equal(1);
		// Please note that getWindowCount() will return 2 if `dev tools` are opened.
		// assert.equal(count, 2)

		// done();
	});

	// it('open window', function () {
	// 	return this.app.client
	// 		.waitUntilWindowLoaded()
	// 		.getWindowCount()
	// 		.should.eventually.equal(1);
	// });

	// it('open window', function () {
	// 	// const result = await v.waitUntilWindowLoaded();

	// 	// console.log(
	// 	// 	'**** waitUntilWindowLoaded() returned:',
	// 	// 	typeof result,
	// 	// 	result
	// 	// );

	// 	// 1.should.equal(1);
	// 	// result.getWindowCount().should.eventually.equal(1);
	// 	this.app.client.getWindowCount().should.eventually.equal(1);
	// 	// done();
	// });

	it('should display a sidebar-heading that reads: angular-electron', async function () {
		const elem = await this.app.client.$('div.sidebar-heading');
		const text = await elem.getText();

		expect(text).to.equal('angular-electron');

		// done();
	});

	it('should display an h1 header in the dashboard-controls-wrapper div that reads: Dashboard Component', async function () {
		const elem = await this.app.client.$(
			'div#dashboard-controls-wrapper h1'
		);
		const text = await elem.getText();

		expect(text).to.equal('Dashboard Component');

		// done();
	});

	// it('opens a window 2', function () {
	// 	const foo = this.app.client
	// 		// .waitUntilWindowLoaded()
	// 		.getWindowCount()
	// 		.should.eventually.have.at.least(11);
	// 	// .should.have.at.least(11);

	// 	console.log('opens a window 2: foo is', typeof foo, foo);

	// 	return this.app.client.browserWindow.isMinimized().should.eventually
	// 		.be.false; // .browserWindow.isVisible()
	// 	// .should.eventually.be.true.browserWindow.isFocused()
	// 	// .should.eventually.be.true.browserWindow.getBounds()
	// 	// .should.eventually.have.property('width')
	// 	// .and.be.above(0)
	// 	// .browserWindow.getBounds()
	// 	// .should.eventually.have.property('height')
	// 	// .and.be.above(0)
	// });

	// it('opens a window xxx', function () {
	// 	return this.app.client
	// 		.waitUntilWindowLoaded()
	// 		.getWindowCount()
	// 		.should.eventually.have.at.least(1)
	// 		.browserWindow.isMinimized()
	// 		.should.eventually.be.false.browserWindow.isVisible()
	// 		.should.eventually.be.true.browserWindow.isFocused()
	// 		.should.eventually.be.true.browserWindow.getBounds()
	// 		.should.eventually.have.property('width')
	// 		.and.be.above(0)
	// 		.browserWindow.getBounds()
	// 		.should.eventually.have.property('height')
	// 		.and.be.above(0);
	// });

	// From http://www.matthiassommer.it/programming/web/integration-e2e-test-electron-mocha-spectron-chai/ :

	// app is our Electron application. Client is the renderer process. This simple example also shows how Chai-as-promised can be used with Spectron. By appending should.eventually.equal(1) we create a promise which is resolved when a window is loaded before the default timeout of five seconds is over. Otherwise, the promise is rejected and the test fails.

	// it('open window', function () {
	// 	return app.client.waitUntilWindowLoaded().getWindowCount().should.eventually.equal(1);
	// });

	// We can also simulate clicks and filling out forms.

	// it("go to login view", function () {
	// 	return app.client.element('#sidebar').element("a*=credentials").click();
	// });

	// This test searches for a DOM element with the ID #sidebar. Within this element it looks for another element which matches the CSS selector a*=credentials . Finally, we simulate a click on this element (in this case a link to another view).

	// For a reference on CSS selectors, I would recommend to have a look on this and this page.

	// You can simulate a click on a button <button>Store login credentials</button> whose text includes Store by using click and the *-selector. Use = to search for an exact match.

	// click('button*=Store')

	it("Click 'Read Config' and check for Obso1337", async function () {
		const buttonElement = await this.app.client.$('button*=Config');
		buttonElement.click();

		// sleep(1);

		const spanElement = await this.app.client.$('span#configObso');
		const text = await spanElement.getText();

		expect(text).to.equal('Obso1337');
	});
});
