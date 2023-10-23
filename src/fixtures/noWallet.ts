import { test as base } from '@playwright/test';
import { App } from '../app';
import { enableFlags, rejectCookies } from 'utils/localStorage';

type MyFixtures = {
	app: App;
};

export const test = base.extend<MyFixtures>({
	app: async ({ page }, use) => {
		const app = new App(page);

		await app.page.goto('');
		await rejectCookies(app);
		if (process.env.FLAGS) {
			await enableFlags({ app, flags: process.env.FLAGS.split(' ') });
		} else {
			enableFlags({ app, flags: ['BaseNetworkEnabled'] });
		}

		await use(app);

		await app.page.close();
	},
});

export const expect = test.expect;
