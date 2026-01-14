import { expect } from '#noWalletFixtures';
import { APIRequestContext } from '@playwright/test';
import { MetaMask } from '@synthetixio/synpress/playwright';
import { App } from 'srcEarnProtocol/app';
import { walletTypes } from './types';
import { expectDefaultTimeout } from 'utils/config';
import { arrayWithNthElements } from 'utils/general';

const mailinatorToken = process.env.MAILINATOR_TOKEN;

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
	network?: 'Arbitrum' | 'Hyperliquid' | 'Sonic';
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

	// Connect wallet popup started nothiding on the 8th January 2026
	await app.page.waitForTimeout(2_000);
	await app.page.reload();

	// // App doesn't reload when loging in at the moment
	// await app.header.shouldHaveWalletAddress(shortenedWalletAddress ?? '0x1064...4743F');

	// await app.page.reload();
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
	await app.page.waitForTimeout(expectDefaultTimeout / 3);

	await app.modals.logIn.enterEmail(emailAddress);
	// Wait to avoid randomfails
	await app.page.waitForTimeout(expectDefaultTimeout / 3);
	await app.modals.logIn.continue();

	// Get Verification Code from email
	let code: string = '';

	const workers = process.env.WORKERS ? parseInt(process.env.WORKERS) : 1;

	await expect(async () => {
		// Wait for 2 seconds
		await app.page.waitForTimeout(2_000);

		const response = await request.get(
			`https://api.mailinator.com/api/v2/domains/private/inboxes?token=${mailinatorToken}&limit=${workers}`
		);

		const responseJSON = await response.json();

		const emailsToCheck = arrayWithNthElements(workers);

		let receiver: string;
		let secondsAgo: string;

		for (const email of emailsToCheck) {
			receiver = responseJSON.msgs[email].to;
			secondsAgo = responseJSON.msgs[email].seconds_ago;

			if (receiver == emailAddress.split('@')[0] && parseInt(secondsAgo) < 30) {
				code = responseJSON.msgs[email].subject.slice(0, 6);
				break;
			}
		}

		expect(code).not.toBe('');
	}).toPass({ timeout: 60_000 });

	await app.modals.logIn.enterVerificationCode(code);

	// App doesn't reload when loging in at the moment
	await app.header.shouldHaveWalletAddress(shortenedWalletAddress ?? '0x91be...5CC30'); // walletaddress linked to tester@summer.testinator.com
	await app.page.waitForTimeout(4_000);

	await expect(async () => {
		await app.page.reload();
		await app.page.waitForTimeout(4_000);
		await app.header.shouldHaveWalletAddress(shortenedWalletAddress ?? '0x91be...5CC30');
		await app.page.waitForTimeout(1_000);
	}).toPass();
};
