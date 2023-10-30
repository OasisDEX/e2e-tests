import { test as base } from '@playwright/test';
import { App } from '../app';
import { updateFlags, rejectCookies } from 'utils/localStorage';

type MyFixtures = {
	app: App;
};

export const test = base.extend<MyFixtures>({
	app: async ({ page }, use) => {
		const app = new App(page);

		await app.page.goto('');
		await app.homepage.shouldBeVisible();

		await rejectCookies(app);
		if (process.env.FLAGS) {
			await updateFlags({ app, flags: process.env.FLAGS.split(' ') });
		} else {
			updateFlags({ app, flags: ['BaseNetworkEnabled'] });
		}

		await use(app);

		await app.page.close();
	},
});

export function step(target: Function, context: ClassMethodDecoratorContext) {
	return function replacementMethod(...args: any) {
		const name = this.constructor.name + '.' + (context.name as string);
		return test.step(name, async () => {
			return await target.call(this, ...args);
		});
	};
}

export const expect = test.expect;
