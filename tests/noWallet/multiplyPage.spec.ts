import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Multiply page', async () => {
	// To be removed after 'Improved Product Discovery Experience' release
	test.skip('It should list only Multiply positions', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		await app.multiply.open();
		await app.multiply.productHub.header.positionType.shouldBe('Multiply');
		await app.multiply.productHub.list.allPoolsShouldBe('Multiply');
	});
});
