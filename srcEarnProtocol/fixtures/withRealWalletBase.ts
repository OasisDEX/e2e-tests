import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import baseRealWalletSetup from '../../utils/synpress/real-wallet-setup/baseRealWallet.setup';
import { App } from '../app';

export const test = metaMaskFixtures(baseRealWalletSetup).extend<{
	app: App;
}>({
	app: async ({ page }, use) => {
		const app = new App(page);

		await app.page.goto('');

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
