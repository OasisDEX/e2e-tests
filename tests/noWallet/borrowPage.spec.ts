import { expect, test } from '#noWalletFixtures';
import { longTestTimeout, positionTimeout } from 'utils/config';
import { arrayWithNthElements } from 'utils/general';

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

	test('It should show next and previous pages in product hub', async ({ app }) => {
		await app.borrow.open();

		await app.borrow.productHub.list.shouldBePage('1');

		await app.borrow.productHub.list.nextPage();
		await app.borrow.productHub.list.shouldBePage('2');

		await app.borrow.productHub.list.nextPage();
		await app.borrow.productHub.list.shouldBePage('3');

		await app.borrow.productHub.list.previousPage();
		await app.borrow.productHub.list.shouldBePage('2');

		await app.borrow.productHub.list.previousPage();
		await app.borrow.productHub.list.shouldBePage('1');
	});

	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((page) => {
		const numberOfPools = page != 10 ? arrayWithNthElements(20) : arrayWithNthElements(7);

		numberOfPools.forEach((poolIndex) => {
			test(`It should open position page for all available Borrow pools - Page ${page} - ${poolIndex}`, async ({
				app,
			}) => {
				test.setTimeout(longTestTimeout);

				await app.borrow.open();

				// Set Min Liquidity to '0' so that all pools are listed
				await app.borrow.productHub.filters.setMinLiquidity({ value: 0.5 });
				await app.borrow.productHub.filters.setMinLiquidity({ value: 0 });

				// Move to page 2 inproduct hub
				for (const pageNumber of arrayWithNthElements(page - 1)) {
					// Move to next in product hub
					await app.borrow.productHub.list.nextPage();
				}

				// Logging pool info for debugging purposes
				const pool = await app.homepage.productHub.list.nthPool(poolIndex).getPool();
				const strategy = await app.homepage.productHub.list.nthPool(poolIndex).getStrategy();
				const protocol = await app.homepage.productHub.list.nthPool(poolIndex).getProtocol();
				const network = await app.homepage.productHub.list.nthPool(poolIndex).getNetwork();
				console.log('Pool Index: ', poolIndex);
				console.log('Pool: ', pool);
				console.log('Strategy: ', strategy);
				console.log('Protocol: ', protocol);
				console.log('Network: ', network);

				await app.homepage.productHub.list.nthPool(poolIndex).shouldBevisible();
				await app.homepage.productHub.list.nthPool(poolIndex).open();

				if (protocol === 'Maker') {
					await app.modals.connectWallet.shouldBeVisible();
				} else {
					await expect(async () => {
						const lostConnection = app.page.getByText('Lost connection');
						const applicationError = app.page.getByText('Application error');
						const positionInfoTab = app.page.getByRole('button', {
							name: 'Position Info',
							exact: true,
						});

						let lostConnectionIsVisible: boolean | undefined;
						let applicationErrorIsVisible: boolean | undefined;

						await expect(async () => {
							lostConnectionIsVisible = await lostConnection.isVisible();
							applicationErrorIsVisible = await applicationError.isVisible();
							const positionInfoTabIsVisible = await positionInfoTab.isVisible();

							expect(
								lostConnectionIsVisible || applicationErrorIsVisible || positionInfoTabIsVisible
							).toBeTruthy();
						}).toPass({ timeout: positionTimeout });

						if (lostConnectionIsVisible || applicationErrorIsVisible) {
							await app.page.reload();
							throw new Error('Go back to loop (expect.toPass) starting point');
						} else {
							await app.position.overview.shouldBeVisible({ timeout: 1_000 });
						}
					}).toPass();
				}
			});
		});
	});
});
