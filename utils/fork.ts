import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as customMetamask from 'utils/customMetamask';
import { App } from 'src/app';

export const addToApp = async ({
	app,
	forkId,
	network,
}: {
	app: App;
	forkId: string;
	network: 'mainnet' | 'optimism' | 'arbitrum';
}) => {
	// Adding fork to app
	await app.page.locator('header > div > div:nth-child(2) > button').click();
	await app.page.getByRole('button', { name: 'Fork settings' }).click();
	await app.page
		.locator(
			`input[placeholder="http://localhost:854${
				network === 'mainnet' ? '5' : network === 'optimism' ? '8' : '6'
			}"]`
		)
		.fill(`https://rpc.tenderly.co/fork/${forkId}`);
	await app.page
		.locator(
			`input[placeholder="21${
				network === 'mainnet' ? '37' : network === 'optimism' ? '40' : '38'
			}"]`
		)
		.fill(network === 'mainnet' ? '1' : network === 'optimism' ? '10' : '42161');
	await app.page.getByRole('button', { name: 'save' }).click();

	// Accepting network switch in Metamamask wallet
	await metamask.allowToAddNetwork();

	if (network === 'mainnet') {
		await customMetamask.allowToAddRPC();
	}
	await metamask.allowToSwitchNetwork();
};
