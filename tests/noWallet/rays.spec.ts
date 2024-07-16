import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('No-wallet connected - Rays', async () => {
	test('It should open connect-wallet popup  - Rays page header', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await app.rays.openPage();

		await app.rays.header.connectWallet();
		await app.modals.connectWallet.shouldBeVisible();
	});

	test('It should open connect-wallet popup - Claim Rays block', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await app.rays.openPage();

		await app.rays.connectWallet();
		await app.modals.connectWallet.shouldBeVisible();
	});
});
