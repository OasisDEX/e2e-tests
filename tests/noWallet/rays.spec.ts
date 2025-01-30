import { expect, test } from '#noWalletFixtures';

test.describe('No-wallet connected - Rays', async () => {
	test('It should link to Rays blog and open in new tab @regression', async ({ app }) => {
		await app.rays.openPage();
		await app.rays.shouldLinkToRaysBlogInNewTab();
	});

	test('It should open connect-wallet popup  - Rays page header @regression', async ({ app }) => {
		await app.rays.openPage();

		await app.rays.header.connectWallet();
		await app.modals.connectWallet.shouldBeVisible();
	});

	test('It should open connect-wallet popup - Claim Rays block @regression', async ({ app }) => {
		await app.rays.openPage();

		await app.rays.connectWallet();
		await app.modals.connectWallet.shouldBeVisible();
	});

	test('It should calculate rays to be earned with migration', async ({ app }) => {
		await app.rays.openPage();
		await app.rays.openCalculator();
		await app.rays.calculator.shouldEstimateRays({
			perYear: 0,
			migration: 0,
			afterOneYear: 0,
		});

		await app.rays.calculator.typeAmount('10000');
		await app.rays.calculator.calculateRays();
		await app.rays.calculator.shouldEstimateRays({
			perYear: 670,
			migration: 130,
			afterOneYear: 800,
		});
	});

	test('It should calculate rays to be earned without migration', async ({ app }) => {
		await app.rays.openPage();
		await app.rays.openCalculator();
		await app.rays.calculator.shouldEstimateRays({
			perYear: 0,
			migration: 0,
			afterOneYear: 0,
		});

		await app.rays.calculator.typeAmount('20000');
		await app.rays.calculator.selectMigration('No');
		await app.rays.calculator.calculateRays();
		await app.rays.calculator.shouldEstimateRays({
			perYear: 1400,
			migration: 0,
			afterOneYear: 1400,
		});
	});

	test('It should have 5x Leaderboard results by default @regression', async ({ app }) => {
		await app.rays.openPage();
		await app.rays.leaderboard.shouldHaveResults(5);
	});

	test('It should search for wallet address in Leaderboard @regression', async ({ app }) => {
		await app.rays.openPage();

		// Wait for leaderboard to fully load before using search tool
		await app.rays.leaderboard.shouldHaveResults(5);
		await app.page.waitForTimeout(1_000);

		await app.rays.leaderboard.search('0xbEf4befb4F230F43905313077e3824d7386E09F8');
		await app.rays.leaderboard.shouldDisplaySearchedAddressInTopRow('0xbef...e09f8');
	});

	test('It should show Rays detailed info from leaderboard result @regression', async ({ app }) => {
		await app.rays.openPage();
		const walletAddress = await app.rays.leaderboard.viewRaysDetailedInfo({ leaderboardResult: 1 });
		await app.rays.shouldShowRaysDetailedInfo(walletAddress);
	});

	test('It should redirect to Leaderboard page', async ({ app }) => {
		await app.rays.openPage();
		await app.rays.leaderboard.shouldNotHaveNextPage();

		await app.rays.leaderboard.viewFullLeaderboard();
		await app.rays.leaderboard.shouldHaveNextPage();
	});

	test('It should show 100x Leaderboard results per page', async ({ app }) => {
		await app.rays.leaderboard.openPage();
		await app.rays.leaderboard.shouldHaveResults(100);
	});

	test('It should have links to Rays blog in Leaderboard, and open in new tab  @regression', async ({
		app,
	}) => {
		await app.rays.openPage();
		await app.rays.leaderboard.shouldLinkToRaysBlogInNewTab();
	});

	test('It should show position Rays - Overview & Manage - Without any automations set up @regression', async ({
		app,
	}) => {
		await app.position.openPage('/ethereum/morphoblue/multiply/WSTETH-ETH-1/1467#overview');
		await app.position.overview.shouldHaveRays('0.000[0-9]');
		await app.position.manage.shouldHaveAutomationBoostRays({
			raysCount: '0.000[0-9]',
			automations: ['Stop Loss', 'Auto Sell', 'Auto Buy', 'Take Profit'],
		});
	});

	test('It should show position Rays - Overview & Manage - With Optimization set up', async ({
		app,
	}) => {
		await app.position.openPage('/ethereum/aave/v3/multiply/ETH-DAI/1670#overview');
		await app.position.overview.shouldHaveRays('0.0[1-6][0-9]{2}');
		await app.position.manage.shouldHaveAutomationBoostRays({
			raysCount: '0.00[0-9]{2}',
			automations: ['Stop Loss', 'Auto Sell'],
		});
	});

	test('It should show position Rays - Overview & Manage - With Protection set up', async ({
		app,
	}) => {
		await app.position.openPage('/ethereum/aave/v3/multiply/RETH-DAI/1276#overview');
		await app.position.overview.shouldHaveRays('0.0[2-6][0-9]{2}');
		await app.position.manage.shouldHaveAutomationBoostRays({
			raysCount: '0.0[1-4][0-9]{2}',
			automations: ['Auto Buy', 'Take Profit'],
		});
	});

	test('It should show Automation Boost Rays - With an automation set up', async ({ app }) => {
		await app.position.openPage('/ethereum/aave/v3/multiply/RETH-DAI/1276#protection');

		// Stop-Loss
		await app.position.manage.shouldHaveAutomationTriggerEarnRays();

		// Trailing Stop-Loss
		await app.position.protection.setup('Trailing Stop-Loss');
		await app.position.manage.shouldHaveAutomationTriggerEarnRays();

		// Auto-Sell
		await app.position.protection.setup('Auto-Sell');
		await app.position.manage.shouldHaveAutomationTriggerEarnRays();

		await app.position.openTab('Optimization');

		// Auto-Buy
		await app.position.optimization.setupOptimization('Auto-Buy');
		await app.position.manage.shouldHaveAutomationTriggerEarnRays();

		// Auto Take Profit
		await app.position.optimization.setupOptimization('Auto Take Profit');
		await app.position.manage.shouldHaveAutomationTriggerEarnRays();
	});

	test('It should show Automation Boost Rays - Without any automations set up', async ({ app }) => {
		await app.position.openPage('/ethereum/aave/v3/multiply/ETH-USDC/1218#protection');

		// Stop-Loss
		await app.position.protection.setup('Stop-Loss');
		await app.position.manage.shouldHaveAutomationBoostRays({ raysCount: '0.[0-9]{4}' });
		await app.position.manage.shouldHaveAutomationTriggerEarnRays();

		// Trailing Stop-Loss
		await app.position.protection.setup('Trailing Stop-Loss');
		await app.position.manage.shouldHaveAutomationBoostRays({ raysCount: '0.[0-9]{4}' });
		await app.position.manage.shouldHaveAutomationTriggerEarnRays();

		// Auto-Sell
		await app.position.protection.setup('Auto-Sell');
		await app.position.manage.shouldHaveAutomationBoostRays({ raysCount: '0.[0-9]{4}' });
		await app.position.manage.shouldHaveAutomationTriggerEarnRays();

		await app.position.openTab('Optimization');

		// Auto-Buy
		await app.position.optimization.setupOptimization('Auto-Buy');
		await app.position.manage.shouldHaveAutomationBoostRays({ raysCount: '0.[0-9]{4}' });
		await app.position.manage.shouldHaveAutomationTriggerEarnRays();

		// Auto Take Profit
		await app.position.optimization.setupOptimization('Auto Take Profit');
		await app.position.manage.shouldHaveAutomationBoostRays({ raysCount: '0.[0-9]{4}' });
		await app.position.manage.shouldHaveAutomationTriggerEarnRays();
	});

	test('It should show Rays to be reduced - Remove automation - Stop-Loss @regression', async ({
		app,
	}) => {
		await app.position.openPage('/ethereum/aave/v3/multiply/RETH-DAI/1276#protection');

		await app.position.protection.removeTrigger();
		await app.position.manage.shouldReduceRays({ raysCount: '0.00[0-9]{2}', automation: true });
	});

	test('It should show Rays to be reduced - Remove automation - Auto-Sell @regression', async ({
		app,
	}) => {
		await app.position.openPage('/optimism/aave/v3/borrow/DAI-WBTC/323#protection');

		await app.position.protection.removeTrigger();
		await app.position.manage.shouldReduceRays({ raysCount: '0.00[0-9]', automation: true });
	});

	test('It should show Rays to be reduced - Remove automation - Trailing Stop-Loss @regression', async ({
		app,
	}) => {
		await app.position.openPage('/arbitrum/aave/v3/multiply/WBTC-USDC/370#protection');

		await app.position.protection.removeTrigger();
		await app.position.manage.shouldReduceRays({ raysCount: '0.000[0-9]', automation: true });
	});

	test('It should NOT show Rays to be reduced - Remove automation - 2x protection automations ON @regression', async ({
		app,
	}) => {
		await app.position.openPage('/optimism/aave/v3/multiply/WBTC-USDC.E/19#protection');
		await app.position.manage.shouldHaveAutomationTriggerEarnRays();

		await app.position.protection.removeTrigger();
		await app.position.manage.shouldHaveConfirmButton();
		await app.position.manage.shouldNotHaveAutomationTriggerEarnRays();
		await app.position.manage.shouldNotHaveReduceRays();
	});

	test('It should show Rays to be reduced - Remove automation - Auto-Buy @regression', async ({
		app,
	}) => {
		await app.position.openPage('/optimism/aave/v3/multiply/WBTC-USDC.E/19#optimization');
		await app.position.protection.removeTrigger();
		await app.position.manage.shouldReduceRays({ raysCount: '0.00[0-9]{2}', automation: true });
	});

	test('It should show Rays to be reduced - Remove automation - Auto Take Profit @regression', async ({
		app,
	}) => {
		await app.position.openPage('/ethereum/aave/v3/multiply/ETH-USDC/1586#optimization');
		await app.position.protection.removeTrigger();
		await app.position.manage.shouldReduceRays({ raysCount: '0.0[0-9]{3}', automation: true });
	});

	test('It should show Position Rays - Portfolio position card', async ({ app }) => {
		await app.portfolio.open('0x10649c79428d718621821Cf6299e91920284743F', { withPositions: true });
		await app.portfolio.positionsHub.positions.first.shouldHave({ rays: '0.0[0-9]{3}' });
	});

	// BUG - https://www.notion.so/oazo/144cbc0395cb478a8b81cff326740123?v=2bb430cfe8ca41ff9f6dde3b129ac0fb&p=0e834846fc2f4718b233daae576be8a7&pm=s
	test.skip('It should show same amount of rays/year in Portfolio, Position and Rays pages', async ({
		app,
	}) => {
		await app.rays.openPage('0x4e16eb48a4e48038828b97c8d8544864638d360e');
		const raysPage: number = await app.rays.getRaysPerYear();

		await app.portfolio.open('0x4e16eb48a4e48038828b97c8d8544864638d360e', { withPositions: true });
		const portfolio: number = await app.portfolio.positionsHub.positions.first.getRaysPerYear();

		await app.position.openPage('/ethereum/aave/v3/multiply/WEETH-ETH/2665#overview');
		const positionPage: number = await app.position.overview.getRaysPerYear();

		// Check that values difference is smaller than 1%
		expect(
			Math.abs(positionPage - portfolio) / portfolio,
			'Portfolio and Position page diff should be less than 1%'
		).toBeLessThan(0.01);
		expect(
			Math.abs(raysPage - portfolio) / portfolio,
			'Portfolio and Rays page diff should be less than 1%'
		).toBeLessThan(0.01);
	});

	test('It should show migratable position in /open-position page', async ({ app }) => {
		await app.rays.openPosition.openPage('0xc2da497f91c687725da514a47731047271a04d3f');

		await app.rays.openPosition.productPicker.shouldDisplayTabs([
			'Migrate',
			'Earn',
			'Borrow',
			'Multiply',
		]);

		await app.rays.openPosition.productPicker.firstProductShouldBeMigratable();
	});

	test('It should NOT show "Migrate" tab in /open-position page', async ({ app }) => {
		await app.rays.openPosition.openPage('0x471b8da4e8d204e33813f4b337e2dda789038df6');

		await app.rays.openPosition.productPicker.shouldDisplayTabs(['Earn', 'Borrow', 'Multiply']);
	});
});

// TEST - TO BE DONE
// Should NOT get points - DeFi Saver position:
// /portfolio/0x7d6149ad9a573a6e2ca6ebf7d4897c1b766841b4#positions
