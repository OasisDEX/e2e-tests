import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as customMetamask from 'utils/customMetamask';
import { App } from 'src/app';

const networks = {
	mainnet: { locator: '5', placeholder: '1' },
	optimism: { locator: '8', placeholder: '10' },
	arbitrum: { locator: '6', placeholder: '42161' },
	base: { locator: '9', placeholder: '8453' },
};

export const addToApp = async ({
	app,
	forkId,
	network,
}: {
	app: App;
	forkId: string;
	network: 'mainnet' | 'optimism' | 'arbitrum' | 'base';
}) => {
	// Adding fork to app
	await app.page.locator('header > div > div:nth-child(2) > button').click();
	await app.page.getByRole('button', { name: 'Fork settings' }).click();
	await app.page
		.locator(`input[placeholder="http://localhost:854${networks[network].locator}"]`)
		.fill(`https://rpc.tenderly.co/fork/${forkId}`);
	await app.page
		.locator(`input[placeholder="${networks[network].placeholder}"]`)
		.fill(networks[network].placeholder);
	await app.page.getByRole('button', { name: 'save' }).click();

	// Accepting network switch in Metamamask wallet
	await metamask.allowToAddNetwork();

	if (network === 'mainnet') {
		await customMetamask.allowToAddRPC();
	}
	await metamask.allowToSwitchNetwork();
};
