import { expect, test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

test.describe('No-wallet connected - Rays', async () => {
	test('It should open connect-wallet popup  - Rays page header', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

		await app.rays.openPage();

		await app.rays.header.connectWallet();
		await app.modals.connectWallet.shouldBeVisible();
	});

	test('It should open connect-wallet popup - Claim Rays block', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(longTestTimeout);

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

	test('It should have 5x Leaderboard results by default', async ({ app }) => {
		await app.rays.openPage();
		await app.rays.leaderboard.shouldHaveResults(5);
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
});
