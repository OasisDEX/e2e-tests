import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as customMetamask from 'utils/customMetamask';
import { App } from 'src/app';

export const confirmAddToken = async ({ app }: { app: App }) => {
	await app.page.waitForTimeout(1_000);
	await customMetamask.changeToCustomGasSettings();
	await app.page.waitForTimeout(1_000);
	await metamask.confirmAddToken();
};
