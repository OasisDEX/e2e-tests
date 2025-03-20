import { expect, test } from '#earnProtocolFixtures';
import { logInWithEmailAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Logged in with Email', async () => {
	test.beforeEach(async ({ app, request }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 35_000);

		await logInWithEmailAddress({
			request,
			app,
			emailAddress: 'tester@summer.testinator.com',
			shortenedWalletAddress: '0x91be...5CC30',
		});
	});

	test('It should open portfolio page', async ({ app }) => {
		await expect(async () => {
			await app.page.waitForTimeout(1_000);
			await app.page.reload();
			await app.header.portfolio();
			await app.portfolio.shouldShowWalletAddress('0x91be...5CC30', {
				timeout: expectDefaultTimeout * 2,
			});
		}).toPass();
	});

	test('It should Send funds', async ({ app }) => {
		await expect(async () => {
			await app.portfolio.open('0x91beb00Fff1E3B1840794E04bc610d307CD5CC30');
			await app.portfolio.shouldShowWalletAddress('0x91be...5CC30', {
				timeout: expectDefaultTimeout * 2,
			});
		}).toPass();

		await app.portfolio.send();

		await app.portfolio.sendModal.shouldBeVisible();
		await app.portfolio.sendModal.to('0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA');
		await app.portfolio.sendModal.selectToken({ token: 'ETH', network: 'Base' });
		await app.portfolio.sendModal.shouldHaveBalance('0.00[0-9]{2}');
		await app.portfolio.sendModal.enterAmount('0.0001');
		await app.portfolio.sendModal.shouldHaveSummary({
			network: 'Base',
			sendingAmount: '0.0001',
			token: 'ETH',
			transactionFee: '[0-9]{1,2}.[0-9]{4}',
		});
		await app.portfolio.sendModal.shouldHaveSendButtonEnabled();
	});
});
