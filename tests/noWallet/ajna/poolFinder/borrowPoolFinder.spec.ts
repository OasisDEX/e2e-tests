import { test } from '#noWalletFixtures';
import { positionTimeout } from 'utils/config';
import { ajnaPoolAddress, usdcContractAddress, wEthContractAddress } from 'utils/testData';

test.describe('Pool finder - Borrow', async () => {
	test.beforeEach(async ({ app }) => {
		await app.poolFinder.open('borrow');
	});

	test('It should open Borrow poolFinder', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11558',
		});

		await app.poolFinder.shouldHaveHeader('Borrow');
		await app.poolFinder.shouldLinkToBlog('Borrow');
	});

	test('It should switch to Earn poolFinder', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11554',
		});

		await app.poolFinder.shouldHaveHeader('Borrow');
		await app.poolFinder.selectPositionCategory('Earn');
		await app.poolFinder.shouldHaveHeader('Earn');
	});

	test('It should list only specific Borrow pool - Filtering by pool address', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '10913',
		});

		test.setTimeout(positionTimeout);

		await app.poolFinder.filterBy({ filter: 'Pool address', value: ajnaPoolAddress });
		await app.poolFinder.list.shouldHavePoolsCount(1);
		await app.poolFinder.list.shouldHaveTokensPair('WSTETH/ETH');
		await app.poolFinder.list.allPoolsShouldBe('Borrow');
	});

	test('It should list only Borrow pools with ETH as collateral - Filtering by collateral contract address', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '10912',
		});

		test.setTimeout(positionTimeout);

		await app.poolFinder.filterBy({ filter: 'Collateral token', value: wEthContractAddress });
		await app.poolFinder.list.shouldHaveOneOrMorePools();
		await app.poolFinder.list.allPoolsShouldBe('Borrow');
		await app.poolFinder.list.allPoolsCollateralShouldContain('ETH');
	});

	test('It should list only Borrow pools with ETH as quote - Filtering by quote contract address', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '10914',
		});

		test.setTimeout(positionTimeout);

		await app.poolFinder.filterBy({ filter: 'Quote token', value: wEthContractAddress });
		await app.poolFinder.list.shouldHaveOneOrMorePools();
		await app.poolFinder.list.allPoolsShouldBe('Borrow');
		await app.poolFinder.list.allPoolsQuoteShouldContain('ETH');
	});

	test('It should list only specific Borrow pool - Filtering by both collateral and quote contract addresses', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11553',
		});

		test.setTimeout(positionTimeout);

		await app.poolFinder.filterBy({ filter: 'Collateral token', value: wEthContractAddress });
		await app.poolFinder.filterBy({ filter: 'Quote token', value: usdcContractAddress });
		await app.poolFinder.list.shouldHavePoolsCount(1);
		await app.poolFinder.list.shouldHaveTokensPair('ETH/USDC');
		await app.poolFinder.list.allPoolsShouldBe('Borrow');
	});

	test('It should open Pool creator', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11604, 11606',
		});

		await app.poolFinder.filterBy({ filter: 'Collateral token', value: 'no-items' });
		await app.poolFinder.noItems.shouldBeVisible();
		await app.poolFinder.noItems.createPool();
		await app.poolCreator.shouldHaveHeader('Ajna Pool Creator');
	});
});
