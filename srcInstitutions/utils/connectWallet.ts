import { MetaMask } from '@synthetixio/synpress/playwright';
import { App } from 'srcInstitutions/app';

export const connectWallet = async ({ app, metamask }: { app: App; metamask: MetaMask }) => {
	await app.header.connectWallet();

	// PRIVY -- Step removed with Privy
	// await app.modals.signIn.continueWithWallet();
	await app.modals.signIn.metamask();
	await metamask.connectToDapp();

	await app.header.shouldHave({ shortenedWalletAddress: '0x1064...4743F' });
	await app.header.shouldNothaveConnectWalletButton();
};
