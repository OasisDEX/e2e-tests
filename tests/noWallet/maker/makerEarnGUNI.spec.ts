import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Maker Earn - GUNI', async () => {
	test('It should open an existing Maker Earn GUNI vault page @regression', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/ethereum/maker/29929#overview');

		await app.position.overview.shouldBeVisible();
		await app.position.overview.shouldHaveNetValue({
			value: '\\$([0-9]{1,2})?([0-9],)?([0-9]{1,2})?[0-9].[0-9]{2}',
		});
		await app.position.overview.shouldHaveTotalCollateral({
			amount: '[0-9].[0-9]{2}',
			token: 'GUNIV3DAIUSDC2',
		});
		await app.position.overview.shouldHaveDebt({
			amount: '[0-9].[0-9]{4}',
			token: 'DAI',
		});

		await app.position.manage.shouldBeVisible('Manage your vault');
	});
});
