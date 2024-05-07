import { test } from '#noWalletFixtures';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';

const numberOfPools = Array.from({ length: 20 }, (_, index) => 0 + index);

test.describe('Borrow page', async () => {
	test('It should open Borrow pool finder', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11557',
		});

		await app.borrow.open();
		await app.borrow.productHub.list.openPoolFinder();

		await app.poolFinder.shouldHaveHeader('Borrow');
	});

	numberOfPools.forEach((poolIndex) => {
		test(`It should open Borrow position page for all available pairs - ${poolIndex}`, async ({
			app,
		}) => {
			await app.borrow.open();

			// Logging pool info for debugging purposes
			const pool = await app.borrow.productHub.list.nthPool(poolIndex).getPool();
			console.log('++++ poolIndex: ', poolIndex);
			console.log('++++ Pool: ', pool);

			await app.borrow.productHub.list.nthPool(poolIndex).shouldBevisible();
			await app.borrow.productHub.list.nthPool(poolIndex).open();

			await app.position.overview.shouldBeVisible();
		});
	});

	(
		[
			{ network: 'Ethereum', protocol: 'Aave V3' },
			{ network: 'Arbitrum', protocol: 'Aave V3' },
			{ network: 'Optimism', protocol: 'Aave V3' },
			{ network: 'Ethereum', protocol: 'Spark' },
		] as const
	).forEach(({ network, protocol }) =>
		test.skip(`It should open Borrow position page for all available pairs - ${network} - ${protocol}`, async ({
			app,
		}) => {
			test.setTimeout(
				network === 'Ethereum' && protocol === 'Aave V3'
					? extremelyLongTestTimeout
					: veryLongTestTimeout
			);

			await app.borrow.open();

			await app.borrow.productHub.filters.networks.select({
				currentFilter: 'All networks',
				networks: [network],
			});
			await app.borrow.productHub.filters.protocols.select({
				currentFilter: 'All protocols',
				protocols: [protocol],
			});

			const allPairs = await app.borrow.productHub.list.getAllPairs();

			for (const pair of allPairs) {
				await test.step(`pair - ${pair}`, async () => {
					await app.borrow.open();
					await app.borrow.productHub.filters.networks.select({
						currentFilter: 'All networks',
						networks: [network],
					});
					await app.borrow.productHub.filters.protocols.select({
						currentFilter: 'All protocols',
						protocols: [protocol],
					});
					// Wait for element to be visible
					await app.borrow.productHub.list.byPairPool(pair).shouldBevisible();
					await app.borrow.productHub.list.byPairPool(pair).open();

					await app.position.shouldHaveHeader(`Open ${pair}`);
					await app.position.overview.shouldBeVisible();
				});
			}
		})
	);
});
