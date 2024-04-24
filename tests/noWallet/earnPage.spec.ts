import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Earn page', async () => {
	// To be removed after 'Improved Product Discovery Experience' release
	test.skip('It should list only Earn positions', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		await app.earn.open();
		await app.earn.productHub.header.positionType.shouldBe('Earn');
		await app.earn.productHub.list.allPoolsShouldBe('Earn');
	});

	test('It should open Earn pool finder', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11556',
		});

		await app.earn.open();
		await app.earn.productHub.list.openPoolFinder();
		await app.poolFinder.shouldHaveHeader('Earn');
	});
});
