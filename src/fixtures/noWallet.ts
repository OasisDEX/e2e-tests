import { test as base } from '@playwright/test';
import { App } from '../app';
import { updateFlagsAndRejectCookies } from 'utils/localStorage';

type MyFixtures = {
	app: App;
};

export const test = base.extend<MyFixtures>({
	app: async ({ page }, use) => {
		const app = new App(page);

		await app.page.goto('');
		await app.homepage.shouldBeVisible();

		if (process.env.FLAGS_FEATURES || process.env.FLAGS_AUTOMATION_MIN_NET_VALUE) {
			await updateFlagsAndRejectCookies({
				app,
				featuresFlags: process.env.FLAGS_FEATURES.split(' '),
				automationMinNetValueFlags: process.env.FLAGS_AUTOMATION_MIN_NET_VALUE.split(' '),
			});
		} else {
			updateFlagsAndRejectCookies({ app });
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
