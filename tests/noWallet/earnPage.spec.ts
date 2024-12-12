import { expect, test } from '#noWalletFixtures';
import { expectDefaultTimeout, longTestTimeout, positionTimeout } from 'utils/config';
import { arrayWithNthElements } from 'utils/general';

const susdePools = Array.from({ length: 5 }, (_, index) => 0 + index);

test.describe('Earn page', async () => {
	test('It should open Earn pool finder', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11556',
		});

		await app.earn.open();
		await app.earn.productHub.list.openPoolFinder();
		await app.poolFinder.shouldHaveHeader('Earn');
	});

	[1, 2, 3, 4, 5, 6, 7].forEach((page) => {
		const numberOfPools = page != 10 ? arrayWithNthElements(20) : arrayWithNthElements(7);

		numberOfPools.forEach((poolIndex) => {
			test(`It should open position page for all available Earn pools - Page ${page} - ${poolIndex}`, async ({
				app,
			}) => {
				test.setTimeout(longTestTimeout);

				await app.earn.open();

				// Move to page 2 inproduct hub
				for (const pageNumber of arrayWithNthElements(page - 1)) {
					// Move to next in product hub
					await app.earn.productHub.list.nextPage();
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
						const overviewTab = app.page.getByRole('button', {
							name: 'Overview',
							exact: true,
						});

						let lostConnectionIsVisible: boolean | undefined;
						let applicationErrorIsVisible: boolean | undefined;
						let positionInfoTabIsVisible: boolean | undefined;
						let overviewTabIsVisible: boolean | undefined;

						await expect(async () => {
							lostConnectionIsVisible = await lostConnection.isVisible();
							applicationErrorIsVisible = await applicationError.isVisible();
							positionInfoTabIsVisible = await positionInfoTab.isVisible();
							overviewTabIsVisible = await overviewTab.isVisible();

							expect(
								lostConnectionIsVisible ||
									applicationErrorIsVisible ||
									positionInfoTabIsVisible ||
									overviewTabIsVisible
							).toBeTruthy();
						}).toPass({ timeout: positionTimeout });

						if (lostConnectionIsVisible || applicationErrorIsVisible) {
							await app.page.reload();
							throw new Error('Go back to loop (expect.toPass) starting point');
						} else {
							await app.position.overview.shouldBeVisible({
								tab: overviewTabIsVisible ? 'Overview' : 'Position Info',
								timeout: 1_000,
							});
						}
					}).toPass();
				}
			});
		});
	});

	susdePools.forEach((poolIndex) => {
		test(`It should show same APY in product hub and position page - Pool index: ${poolIndex} @regression`, async ({
			app,
		}) => {
			await app.page.goto('/earn?protocol=morphoblue&deposit-token=SUSDE');

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

			const productHubAPY = await app.earn.productHub.list.nthPool(poolIndex).getAPY();

			await app.earn.productHub.list.nthPool(poolIndex).shouldBevisible();
			await app.earn.productHub.list.nthPool(poolIndex).open();

			await app.position.overview.shouldBeVisible({ tab: 'Position Info' });
			const positionPageAPY = await app.position.getAPY();

			expect(Math.abs(positionPageAPY - productHubAPY)).toBeLessThan(0.1);
		});
	});
});
