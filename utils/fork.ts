import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as customMetamask from 'utils/customMetamask';
import { App } from 'src/app';

export const addToApp = async ({ app, forkId }: { app: App; forkId: string }) => {
	// Adding fork to app
	await app.page.locator('header > div > div:nth-child(2) > button').click();
	await app.page.getByRole('button', { name: 'Fork settings' }).click();
	await app.page
		.locator('input[placeholder="http://localhost:8545"]')
		.fill(`https://rpc.tenderly.co/fork/${forkId}`);
	await app.page.locator('input[placeholder="2137"]').fill('1');
	await app.page.getByRole('button', { name: 'save' }).click();

	// Accepting network switch in Metamamask wallet
	await metamask.allowToAddNetwork();
	await customMetamask.allowToAddRPC();
	await metamask.allowToSwitchNetwork();
};
