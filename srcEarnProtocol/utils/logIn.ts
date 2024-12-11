import { step } from '#noWalletFixtures';
import { MetaMask } from '@synthetixio/synpress/playwright';
import { App } from 'srcEarnProtocol/app';
import { walletTypes } from './types';

export const logInWithWalletAddress = async ({
	metamask,
	app,
	wallet,
	network, // This property should be removed in the future
}: {
	metamask: MetaMask;
	app: App;
	wallet: walletTypes;
	network?: 'Arbitrum';
}) => {
	await app.header.logIn();
	await app.modals.logIn.withWallet();
	await app.modals.logIn.selectWallet(wallet);
	await metamask.connectToDapp();

	// TO BE REMOVED in the future
	if (network) {
		// Earn protocol app switches to Base by default
		await metamask.approveNewNetwork();
		await metamask.approveSwitchNetwork();

		// SKIPPED - Weird issue with Arbitrumwhen switching network in main page (/)
		// // Switch back to Arbitrum
		// await metamask.switchNetwork('arbitrum');
	}

	// App doesn't reload when loging in at the moment
	await app.header.shouldHaveWalletAddress('0x1064...4743F');
	await app.page.reload();
};
