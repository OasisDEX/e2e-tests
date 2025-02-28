import { expect } from '#noWalletFixtures';
import { APIRequestContext } from '@playwright/test';
import { MetaMask } from '@synthetixio/synpress/playwright';
import { App } from 'srcEarnProtocol/app';
import { walletTypes } from './types';
import { expectDefaultTimeout } from 'utils/config';

export const logInWithWalletAddress = async ({
	metamask,
	app,
	wallet,
	network, // This property should be removed in the future
	shortenedWalletAddress,
}: {
	metamask: MetaMask;
	app: App;
	wallet: walletTypes;
	network?: 'Arbitrum';
	shortenedWalletAddress?: string;
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
	}

	// App doesn't reload when loging in at the moment
	await app.header.shouldHaveWalletAddress(shortenedWalletAddress ?? '0x1064...4743F');
	await app.page.reload();
};

export const logInWithEmailAddress = async ({
	request,
	app,
	emailAddress,
	shortenedWalletAddress,
}: {
	request: APIRequestContext;
	app: App;
	emailAddress: string;
	shortenedWalletAddress?: string;
}) => {
	await app.header.logIn();

	// Wait to avoid randomfails
	await app.modals.logIn.shouldBeVisible();
	await app.page.waitForTimeout(expectDefaultTimeout / 5);

	await app.modals.logIn.enterEmail(emailAddress);
	await app.modals.logIn.continue();

	// Get Verification Code from email
	let code: string = '';

	await expect(async () => {
		// Wait for 2 seconds
		await app.page.waitForTimeout(5_000);

		const response = await request.get(
			'https://api.mailinator.com/api/v2/domains/private/inboxes?token=79bba236cd0d4ef195d5664cee6a1d31'
		);

		const responseJSON = await response.json();

		const secondsAgo = responseJSON.msgs[0].seconds_ago;

		expect(secondsAgo).toBeLessThan(30);

		code = responseJSON.msgs[0].subject.slice(0, 6);
	}).toPass({ timeout: 30_000 });

	await app.modals.logIn.enterVerificationCode(code);

	// App doesn't reload when loging in at the moment
	await app.header.shouldHaveWalletAddress(shortenedWalletAddress ?? '0x91be...5CC30'); // walletaddress linked to tester@summer.testinator.com
	await app.page.waitForTimeout(1_000);
	await app.page.reload();
	await app.page.waitForTimeout(1_000);
};
