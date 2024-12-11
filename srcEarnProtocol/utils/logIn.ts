import { step } from '#noWalletFixtures';
import { MetaMask } from '@synthetixio/synpress/playwright';
import { App } from 'srcEarnProtocol/app';
import { walletTypes } from './types';

export const logInWithWalletAddress = async ({
	metamask,
	app,
	wallet,
}: {
	metamask: MetaMask;
	app: App;
	wallet: walletTypes;
}) => {
	await app.header.logIn();
	await app.modals.logIn.withWallet();
	await app.modals.logIn.selectWallet(wallet);
	await metamask.connectToDapp();

	// App doesn't reload when loging in at the moment
	await app.header.shouldHaveWalletAddress('0x1064...4743F');
	await app.page.reload();
};
