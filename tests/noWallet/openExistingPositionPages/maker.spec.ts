import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('Open exisiting position pages - Maker', async () => {
	test('It should open an existing Maker Earn DSR position page @regression', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/earn/dsr/0x10649c79428d718621821cf6299e91920284743f#overview');

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

		await app.page.goto('/ethereum/maker/30640#overview');

		await app.position.shouldHaveHeader('ETH-C Vault 30640');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
		});
	});

	test('It should open an existing Maker Multiply ETH-C/DAI position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('https://summer.fi/ethereum/maker/30639#overview');

		await app.position.shouldHaveHeader('ETH-C Vault 30639');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '0.00',
		});
	});
});
