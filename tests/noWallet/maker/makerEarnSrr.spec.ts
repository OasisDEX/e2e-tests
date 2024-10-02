import { test } from '#noWalletFixtures';

test.describe('Maker Earn - SRR - No wallet connected', async () => {
	test('It should show Sky Rewards Rate & Total USDS Locked @regression', async ({ app }) => {
		await app.position.openPage('/earn/srr#overview', {
			tab: 'Overview',
		});

		await app.position.overview.shouldHaveSkyRewardsRate('[0-9]{1,2}.[0-9]{2}%');
		await app.position.overview.shouldHaveTotalUsdsLocked('[0-9]{3}.[0-9]{2}M');
	});

	test('It should open an existing Maker Earn SRR position page @regression', async ({ app }) => {
		await app.position.openPage('/earn/srr/0xddc68f9de415ba2fe2fd84bc62be2d2cff1098da#overview', {
			tab: 'Overview',
		});

		await app.position.overview.shouldHaveCollateralDeposited({
			stakingUsds: true,
			amount: '[0-9]{1,2}.[0-9]{2}',
			token: 'USDS',
		});
		await app.position.overview.shouldHaveSkyRewardsRate('[0-9]{1,2}.[0-9]{2}%');
		await app.position.overview.shouldHaveSkyEarned('[0-9]{1,2}.[0-9]{2}([0-9]{2})?');

		await app.position.overview.shouldHaveTotalUsdsLocked('[0-9]{3}.[0-9]{2}M');
		await app.position.overview.shouldHaveTotalSkyEarned('[0-9]{1,2}.[0-9]{2}');

		await app.position.manage.shouldHaveConnectWalletButton();
	});
});
