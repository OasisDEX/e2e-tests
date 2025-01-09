import { test } from '#noWalletFixtures';
import { longTestTimeout, positionTimeout } from 'utils/config';

test.describe('Open exisiting position pages - Spark', async () => {
	test('It should open an existing Spark Earn WSTETH/ETH position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/ethereum/spark/earn/WSTETH-ETH/1417#overview');

		await app.position.shouldHaveHeader('WSTETH/ETH yield multiple #1417');
		await app.position.overview.shouldHaveNetValue({
			value: '[0-9]{1,2}.[0-9]{2}',
		});
	});

	test('It should open an existing Spark Borrow ETH/DAI position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/ethereum/spark/borrow/ETH-DAI/2397#overview');

		await app.position.shouldHaveHeader('ETH/DAI Borrow #2397');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '([0-9]{1,2},)?[0-9]{3}.[0-9]{2}',
			token: 'ETH/DAI',
			timeout: positionTimeout,
		});
	});

	test('It should open an existing Spark Multiply SDAI/ETH position page @regression', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/ethereum/spark/multiply/SDAI-ETH/1448#overview');

		await app.position.shouldHaveHeader('SDAI/ETH Multiply #1448');
		await app.position.overview.shouldHaveLiquidationPrice({
			price: '([0-9]{1,2},)?[0-9]{3}.[0-9]{2}',
			timeout: positionTimeout,
		});
	});
});
