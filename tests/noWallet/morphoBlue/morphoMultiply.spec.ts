import { test } from '#noWalletFixtures';

test.describe('MorphoBlue - Multiply', async () => {
	test('It should open an existing Morpho Blue Multiply sUSDe/DAI position page @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		await app.position.openPage('/ethereum/morphoblue/multiply/SUSDE-DAI-3/1467#overview');

		await app.position.overview.shouldBeVisible();
		await app.position.overview.shouldHaveNetValue({
			// value: '\\$([0-9]{1,2})?([0-9],)?([0-9]{1,2})?[0-9].[0-9]{2}',
			value: '\\$([0-9]{1,3},)?[0-9]{1,3}.[0-9]{2}',
		});
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '[0-9]{1,2}.[0-9]{4}',
			token: 'DAI/SUSDE',
		});
		await app.position.overview.shouldHaveExposure({
			amount: '[0-9].[0-9]{4}',
			token: 'SUSDE',
		});
		await app.position.overview.shouldHaveDebt({
			amount: '[0-9].[0-9]{4}',
			token: 'DAI',
		});

		await app.position.manage.shouldBeVisible('Manage your Morpho Earn');
	});
});
