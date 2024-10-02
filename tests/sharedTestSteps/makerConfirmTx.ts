import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as customMetamask from 'utils/customMetamask';
import { App } from 'src/app';
import test from '@playwright/test';

export const confirmAddToken = async ({ app }: { app: App }) => {
	await test.step('Confirm Add token', async () => {
		await app.page.waitForTimeout(1_000);
		await customMetamask.changeToCustomGasSettings();
		await app.page.waitForTimeout(1_000);
		await metamask.confirmAddToken();
	});
};
