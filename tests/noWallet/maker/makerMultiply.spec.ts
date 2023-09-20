import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Maker Multiply', async () => {
	test('It should open existent Maker Multiply Ethereum vault page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		test.info().annotations.push({
			type: 'Test case',
			description: '11997',
		});

		await app.page.goto('/ethereum/maker/10187#overview');

		await app.position.shouldHaveHeader('ETH-A Vault 10187');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[0-9]{3}.[0-9]{2}',
		});
		await app.position.overview.shouldHaveBuyingPower('[0-9]{2}.[0-9]{2}');
		await app.position.overview.shouldHaveNetValue({ value: '[0-9]{2,3}.[0-9]{2}' });
		await app.position.overview.shouldHaveDebt({
			amount: '[0-9]{1,2}.[0-9]{4}',
			token: 'DAI',
		});
		await app.position.overview.shouldHaveTotalCollateral({
			amount: '0.[0-3][1-9][0-9]{2}',
			token: 'ETH',
		});
		await app.position.overview.shouldHaveMultiple('1.[0-9]{2}');

		await app.position.setup.shouldHaveLiquidationPrice({
			amount: '[0-9]{3}.[0-9]{2}',
		});
		await app.position.manage.shouldHaveCollateralRatio('[0-9]{3,4}');
	});
});
