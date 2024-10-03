import { test } from '#noWalletFixtures';

test.describe('Maker Earn - CLE - No wallet connected', async () => {
	// Bug --> https://www.notion.so/oazo/144cbc0395cb478a8b81cff326740123?v=2bb430cfe8ca41ff9f6dde3b129ac0fb&p=1138cbaf47f88088bf87d72ba3f7b940&pm=s
	test.skip('It should show Total USDS Locked @regression', async ({ app }) => {
		await app.position.openPage('/earn/cle#overview', {
			tab: 'Overview',
		});

		await app.position.overview.shouldHaveTotalUsdsLocked('[0-9]{2,3}.[0-9]{2}M');
	});

	test('It should open an existing Maker Earn CLE position page @regression', async ({ app }) => {
		await app.position.openPage('/earn/cle/0xddc68f9de415ba2fe2fd84bc62be2d2cff1098da#overview', {
			tab: 'Overview',
		});

		await app.position.overview.shouldHaveCollateralDeposited({
			stakingUsds: true,
			amount: '[0-9]{1,2}.[0-9]{2}',
			token: 'USDS',
		});
		await app.position.overview.shouldHaveClePointsEarned('[0-9]{1,2}.[0-9]{2}([0-9]{2})?');
		await app.position.overview.shouldHaveTotalUsdsLocked('[0-9]{2,3}.[0-9]{2}M');

		await app.position.manage.shouldHaveConnectWalletButton();
	});
});
