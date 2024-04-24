import { test } from '#noWalletFixtures';
import { extremelyLongTestTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';

test.describe('Borrow page', async () => {
	// To be removed after 'Improved Product Discovery Experience' release
	test.skip('It should list only Borrow positions', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		await app.borrow.open();
		await app.borrow.productHub.header.positionType.shouldBe('Borrow');
		await app.borrow.productHub.list.allPoolsShouldBe('Borrow');
	});

	test('It should open Borrow pool finder', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11557',
		});

		await app.borrow.open();
		await app.borrow.productHub.list.openPoolFinder();

		await app.poolFinder.shouldHaveHeader('Borrow');
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

	// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].forEach((positionIndex) =>
	// 	test.skip(`It should open Borrow position page for all available pairs - ${positionIndex}`, async ({
	// 		app,
	// 	}) => {
	// 		test.setTimeout(longTestTimeout);

	// 		await app.borrow.open();

	// 		// Wait for element to be visible
	// 		await app.borrow.productHub.list.nthPool(positionIndex).shouldBevisible();
	// 		await app.borrow.productHub.list.byPairPool(pair).open();

	// 		// Wait for element to be visible
	// 		await app.borrow.productHub.list.byPairPool(pair).shouldBevisible();
	// 		await app.borrow.productHub.list.byPairPool(pair).open();

	// 		await app.position.shouldHaveHeader(`Open ${pair}`);
	// 		await app.position.overview.shouldBeVisible();
	// 	})
	// );
});
