import { test as base } from '@playwright/test';
import { App } from './app';

type MyFixtures = {
	app: App;
};

export const test = base.extend<MyFixtures>({
	app: async ({ page }, use) => {
		const app = new App(page);

		await use(app);

		await app.page.close();
	},
});
