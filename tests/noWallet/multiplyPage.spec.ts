import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Multiply page', async () => {
	test('It should list only Multiply positions', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		await app.multiply.open();
		await app.multiply.productHub.header.position.shouldBe('Multiply');
		await app.multiply.productHub.list.allPoolsShouldBe('Multiply');
	});
});
