import { test } from '#fixtures';
import { ajnaPoolAddress, usdcContractAddress, wEthContractAddress } from 'utils/testData';

test.describe('Pool finder - Earn', async () => {
	test.beforeEach(async ({ app }) => {
		await app.poolFinder.open('earn');
	});

	test('It should open Earn poolFinder', async ({ app }) => {
		await app.poolFinder.shouldHaveHeader('Earn');
		await app.poolFinder.shouldLinkToBlog('Earn');
	});

	test('It should switch to Borrow poolFinder', async ({ app }) => {
		await app.poolFinder.shouldHaveHeader('Earn');

		await app.poolFinder.selectPositionCategory('Borrow');
		await app.poolFinder.shouldHaveHeader('Borrow');
	});

	test('It should list specific pool - Filtering by pool addresses', async ({ app }) => {
		await app.poolFinder.filterBy({ filter: 'Pool address', value: ajnaPoolAddress });
		await app.poolFinder.list.shouldHavePoolsCount(1);
		await app.poolFinder.list.shouldHaveTokensPair('ETH/USDC');
		await app.poolFinder.list.allPoolsShouldBe('Earn');
	});

	test('It should list only Earn pools with *ETH as collateral - Filtering by collateral contract address', async ({
		app,
	}) => {
		await app.poolFinder.filterBy({ filter: 'Collateral token', value: wEthContractAddress });
		await app.poolFinder.list.allPoolsShouldBe('Earn');
		await app.poolFinder.list.allPoolsCollateralShouldContain('ETH');
	});

	test('It should list only Earn pools with *ETH as quote - Filtering by quote contract address', async ({
		app,
	}) => {
		await app.poolFinder.filterBy({ filter: 'Quote token', value: wEthContractAddress });
		await app.poolFinder.list.allPoolsShouldBe('Earn');
		await app.poolFinder.list.allPoolsQuoteShouldContain('ETH');
	});

	test('It should list specific pool - Filtering by both collateral and quote contract addresses', async ({
		app,
	}) => {
		await app.poolFinder.filterBy({ filter: 'Collateral token', value: wEthContractAddress });
		await app.poolFinder.filterBy({ filter: 'Quote token', value: usdcContractAddress });
		await app.poolFinder.list.shouldHavePoolsCount(1);
		await app.poolFinder.list.shouldHaveTokensPair('ETH/USDC');
		await app.poolFinder.list.allPoolsShouldBe('Earn');
	});
});
