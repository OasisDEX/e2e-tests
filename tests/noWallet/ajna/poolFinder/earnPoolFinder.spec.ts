import { test } from '#noWalletFixtures';
import { ajnaPoolAddress, usdcContractAddress, wEthContractAddress } from 'utils/testData';

test.describe('Pool finder - Earn', async () => {
	test.beforeEach(async ({ app }) => {
		await app.poolFinder.open('earn');
	});

	test('It should link to Earn blog', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11559',
		});

		await app.poolFinder.shouldHaveHeader('Earn');
		await app.poolFinder.shouldLinkToBlog('Earn');
	});

	test('It should switch to Borrow poolFinder', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11555',
		});

		await app.poolFinder.shouldHaveHeader('Earn');

		await app.poolFinder.selectPositionCategory('Borrow');
		await app.poolFinder.shouldHaveHeader('Borrow');
	});

	test('It should list only specific Earn pool - Filtering by pool addresses', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '10932',
		});

		await app.poolFinder.filterBy({ filter: 'Pool address', value: ajnaPoolAddress });
		await app.poolFinder.list.shouldHavePoolsCount(1);
		await app.poolFinder.list.shouldHaveTokensPair('WSTETH/ETH');
		await app.poolFinder.list.allPoolsShouldBe('Earn');
	});

	test('It should list only existing Earn pools with ETH as collateral - Filtering by collateral contract address', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '10930',
		});

		await app.poolFinder.filterBy({ filter: 'Collateral token', value: wEthContractAddress });
		await app.poolFinder.list.shouldHaveOneOrMorePools();
		await app.poolFinder.list.allPoolsShouldBe('Earn');
		await app.poolFinder.list.allPoolsCollateralShouldContain('ETH');
	});

	test('It should list only existing Earn pools with ETH as quote - Filtering by quote contract address', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '10931',
		});

		await app.poolFinder.filterBy({ filter: 'Quote token', value: wEthContractAddress });
		await app.poolFinder.list.shouldHaveOneOrMorePools();
		await app.poolFinder.list.allPoolsShouldBe('Earn');
		await app.poolFinder.list.allPoolsQuoteShouldContain('ETH');
	});

	test('It should list only specific Earn pool - Filtering by both collateral and quote contract addresses', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11552',
		});

		await app.poolFinder.filterBy({ filter: 'Collateral token', value: wEthContractAddress });
		await app.poolFinder.filterBy({ filter: 'Quote token', value: usdcContractAddress });
		await app.poolFinder.list.shouldHavePoolsCount(1);
		await app.poolFinder.list.shouldHaveTokensPair('ETH/USDC');
		await app.poolFinder.list.allPoolsShouldBe('Earn');
	});

	test('It should open Pool creator', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11605, 11607',
		});

		await app.poolFinder.filterBy({ filter: 'Collateral token', value: 'no-items' });
		await app.poolFinder.noItems.shouldBeVisible();
		await app.poolFinder.noItems.createPool();
		await app.poolCreator.shouldHaveHeader('Ajna Pool Creator');
	});
});
