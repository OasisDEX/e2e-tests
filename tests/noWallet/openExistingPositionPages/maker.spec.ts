import { test } from '#noWalletFixtures';
import { longTestTimeout, positionTimeout } from 'utils/config';

test.describe('Open exisiting position pages - Maker', async () => {
	// SKIPPED - BUG on staging - DAI count incorrectly reads '0'
	test.skip('It should open an existing Maker Earn DSR position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/earn/dsr/0x10649c79428d718621821cf6299e91920284743f#overview', {
			tab: 'Overview',
		});

		await app.position.shouldHaveHeader('Dai Savings Rate');
		await app.position.overview.shouldHaveNetValue({
			value: '[0-9]{1,2}.[0-9]{2}',
			token: 'DAI',
			sdr: { savingsToken: 'DAI' },
		});
	});

	test('It should open an existing Maker Borrow ETH-C/DAI position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/ethereum/maker/30640#overview', { tab: 'Overview' });

		await app.position.shouldHaveHeader('ETH-C Vault 30640');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			timeout: positionTimeout,
		});
	});

	test('It should open an existing Maker Multiply ETH-C/DAI position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/ethereum/maker/30639#overview', { tab: 'Overview' });

		await app.position.shouldHaveHeader('ETH-C Vault 30639');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
			timeout: positionTimeout,
		});
	});
});
