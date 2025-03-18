import * as customMetamask from 'utils/customMetamask';
import { App } from 'src/app';
import test from '@playwright/test';
import { MetaMask } from '@synthetixio/synpress/playwright';

export const confirmAddToken = async ({ metamask, app }: { metamask: MetaMask; app: App }) => {
	await test.step('Confirm Add token', async () => {
		// await app.page.waitForTimeout(1_000);
		// await customMetamask.changeToCustomGasSettings();
		await app.page.waitForTimeout(1_000);
		await metamask.addNewToken(); //confirmSignature();
	});
};

export const confirmTransaction = async ({ metamask, app }: { metamask: MetaMask; app: App }) => {
	await test.step('Confirm Transaction', async () => {
		// await app.page.waitForTimeout(1_000);
		// await customMetamask.changeToCustomGasSettings();
		await app.page.waitForTimeout(1_000);
		await metamask.confirmTransaction({ gasSetting: 'aggressive' });
	});
};
