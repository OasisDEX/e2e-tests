import { test } from '#fixtures';
import { ajnaPoolAddress, usdcContractAddress, wEthContractAddress } from 'utils/testData';

test.describe('Pool finder - Borrow', async () => {
	test.beforeEach(async ({ app }) => {
		await app.poolFinder.open('borrow');
	});

	test('It should open Borrow poolFinder', async ({ app }) => {
		await app.poolFinder.shouldHaveHeader('Borrow');
		await app.poolFinder.shouldLinkToBlog('Borrow');
	});

	test('It should switch to Earn poolFinder', async ({ app }) => {
		await app.poolFinder.shouldHaveHeader('Borrow');

		await app.poolFinder.selectPositionCategory('Earn');
		await app.poolFinder.shouldHaveHeader('Earn');
	});

	test('It should list specific pool - Filtering by pool addresses @regression', async ({
		app,
	}) => {
		await app.poolFinder.filterBy({ filter: 'Pool address', value: ajnaPoolAddress });
		await app.poolFinder.list.shouldHavePoolsCount(1);
		await app.poolFinder.list.shouldHaveTokensPair('ETH/USDC');
		await app.poolFinder.list.allPoolsShouldBe('Borrow');
	});

	test('It should list only Borrow pools with *ETH as collateral - Filtering by collateral contract address', async ({
		app,
	}) => {
		await app.poolFinder.filterBy({ filter: 'Collateral token', value: wEthContractAddress });
		await app.poolFinder.list.allPoolsShouldBe('Borrow');
		await app.poolFinder.list.allPoolsCollateralShouldContain('ETH');
	});

	test('It should list only Borrow pools with *ETH as quote - Filtering by quote contract address', async ({
		app,
	}) => {
		await app.poolFinder.filterBy({ filter: 'Quote token', value: wEthContractAddress });
		await app.poolFinder.list.allPoolsShouldBe('Borrow');
		await app.poolFinder.list.allPoolsQuoteShouldContain('ETH');
	});

	test('It should list specific pool - Filtering by both collateral and quote contract addresses', async ({
		app,
	}) => {
		await app.poolFinder.filterBy({ filter: 'Collateral token', value: wEthContractAddress });
		await app.poolFinder.filterBy({ filter: 'Quote token', value: usdcContractAddress });
		await app.poolFinder.list.shouldHavePoolsCount(1);
		await app.poolFinder.list.shouldHaveTokensPair('ETH/USDC');
		await app.poolFinder.list.allPoolsShouldBe('Borrow');
	});
});
