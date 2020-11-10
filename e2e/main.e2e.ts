// angular-electron/e2e/main.e2e.ts

import { expect } from 'chai';

import commonSetup from './common-setup';

describe('Application launch', function () {
	commonSetup.apply(this);

	it('shows an initial window', async function (done) {
		const count = await this.client.getWindowCount();

		expect(count).to.equal(1);
		// Please note that getWindowCount() will return 2 if `dev tools` are opened.
		// assert.equal(count, 2)

		done();
	});

	it('should display a sidebar-heading that reads: angular-electron', async function (done) {
		const elem = await this.client.$('div.sidebar-heading');
		const text = await elem.getText();

		expect(text).to.equal('angular-electron');

		done();
	});

	it('should display an h1 header in the dashboard-controls-wrapper div that reads: Dashboard Component', async function (done) {
		const elem = await this.client.$('div#dashboard-controls-wrapper h1');
		const text = await elem.getText();

		expect(text).to.equal('Dashboard Component');

		done();
	});
});
