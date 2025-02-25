import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import baseRealWalletSetup from '../../utils/synpress/real-wallet-setup/baseRealWallet.setup';
import { App } from '../app';
import { earnProtocolBaseUrl } from 'utils/config';

export const test = metaMaskFixtures(baseRealWalletSetup).extend<{
	app: App;
}>({
	app: async ({ page, context }, use) => {
		const app = new App(page);

		await app.page.goto('');

		await context.addCookies([
			{
				name: 'analyticsCookie',
				value:
					'%7B%22accepted%22%3Atrue%2C%22enabledCookies%22%3A%7B%22marketing%22%3Atrue%2C%22analytics%22%3Atrue%7D%2C%22version%22%3A%22version-27.08.2024%22%7D',
				url: earnProtocolBaseUrl,
			},
		]);

		await app.waitForAppToBeStable();

		await use(app);

		await app.page.close();
	},
});

export function step(target: Function, context: ClassMethodDecoratorContext) {
	return function replacementMethod(this: any, ...args: any) {
		const name = this.constructor.name + '.' + (context.name as string);
		return test.step(name, async () => {
			return await target.call(this, ...args);
		});
	};
}

export const expect = test.expect;
