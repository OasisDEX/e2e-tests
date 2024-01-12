import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Maker Multiply', async () => {
	test('It should open an existing Maker Multiply vault page @regression', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11997',
		});

		await app.page.goto('/ethereum/maker/30640#overview');

		await app.position.shouldHaveHeader('ETH-C Vault 30640');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '\\$0.00',
		});
		await app.position.overview.shouldHaveBuyingPower('\\$0.00');
		await app.position.overview.shouldHaveNetValue({ value: '\\$0.00' });
		await app.position.overview.shouldHaveDebt({
			amount: '0.0000',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveTotalCollateral({
			amount: '0.00',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveMultiple('0.00');

		await app.position.manage.shouldBeVisible('Manage your vault');
	});
});
