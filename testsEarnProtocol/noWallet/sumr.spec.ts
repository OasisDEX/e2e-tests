import { test } from '#earnProtocolFixtures';
import { expect } from '#noWalletFixtures';

test.describe('$SUMR', async () => {
	test.beforeEach(async ({ app }) => {
		await app.sumr.openPage();
	});

	test('It should open log in popup', async ({ app }) => {
		await app.sumr.connectWallet();
		await app.modals.logIn.shouldBeVisible();
	});

	test('It should search for keyword', async ({ app }) => {
		await app.sumr.search('pete', { selectResultNth: 1 });
		await app.sumr.shouldHaveHeader('Address jerroldpetersonjr.eth is eligible for $SUMR');
	});
});
