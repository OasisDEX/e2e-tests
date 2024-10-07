import { test } from '#noWalletFixtures';
import { portfolioTimeout } from 'utils/config';

test.describe('Portfolio - USDS Staking', async () => {
	test('Portfolio - It should show correct info for Sky Earn USDS - Sky Rewards - position', async ({
		app,
	}) => {
		test.setTimeout(portfolioTimeout * 1.5);

		await app.portfolio.open('0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA', { withPositions: true });

		await app.portfolio.positionsHub.positions
			.byUsdsStakingType('Sky Rewards Rate')
			.shouldHave({ assets: { usdsStakingType: 'Sky Rewards Rate' } });

		await app.portfolio.positionsHub.positions
			.byUsdsStakingType('Sky Rewards Rate')
			.shouldHave({ netValue: { token: 'USDS', amount: '[0-9]{1,2}.[0-9]{2}' } });

		await app.portfolio.positionsHub.positions
			.byUsdsStakingType('Sky Rewards Rate')
			.shouldHave({ netValue: { token: 'USDS', greaterThanZero: true } });

		await app.portfolio.positionsHub.positions
			.byUsdsStakingType('Sky Rewards Rate')
			.shouldHave({ earnings: { token: 'SKY', amount: '[0-9].[0-9]{4}' } });

		await app.portfolio.positionsHub.positions
			.byUsdsStakingType('Sky Rewards Rate')
			.shouldHave({ earnings: { token: 'SKY', greaterThanZero: true } });

		await app.portfolio.positionsHub.positions
			.byUsdsStakingType('Sky Rewards Rate')
			.shouldHave({ currentAPY: '[0-9]{1,2}.[0-9]{2}' });
	});

	test('Portfolio - It should show correct info for Sky Earn USDS - Chronicle Points - position', async ({
		app,
	}) => {
		test.setTimeout(portfolioTimeout * 1.5);

		await app.portfolio.open('0xDDc68f9dE415ba2fE2FD84bc62Be2d2CFF1098dA', { withPositions: true });

		await app.portfolio.positionsHub.positions
			.byUsdsStakingType('Chronicle Points')
			.shouldHave({ assets: { usdsStakingType: 'Chronicle Points' } });

		await app.portfolio.positionsHub.positions
			.byUsdsStakingType('Chronicle Points')
			.shouldHave({ netValue: { token: 'USDS', amount: '[0-9]{1,2}.[0-9]{2}' } });

		await app.portfolio.positionsHub.positions
			.byUsdsStakingType('Chronicle Points')
			.shouldHave({ netValue: { token: 'USDS', greaterThanZero: true } });

		await app.portfolio.positionsHub.positions
			.byUsdsStakingType('Chronicle Points')
			.shouldHave({ earnings: { token: 'CLE', amount: '[0-9]{2,3}.[0-9]{2}' } });

		await app.portfolio.positionsHub.positions
			.byUsdsStakingType('Chronicle Points')
			.shouldHave({ earnings: { token: 'CLE', greaterThanZero: true } });
	});
});
