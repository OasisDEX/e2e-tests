import { expect, test } from '#noWalletFixtures';
import { longTestTimeout, positionTimeout } from 'utils/config';

const numberOfPools = Array.from({ length: 10 }, (_, index) => 0 + index);

test.describe('Homepage', async () => {
	test('It should open connect-wallet popup - Homepage @regression', async ({ app }) => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12333',
		});

		test.setTimeout(longTestTimeout);

		await app.homepage.connectWallet();
		await app.modals.connectWallet.shouldBeVisible();
	});

	test('It should open Rays page', async ({ app }) => {
		await app.homepage.openRaysPage();
		await app.rays.shouldBeVivible();
	});

	test('It should list Earn positions by default', async ({ app }) => {
		await app.homepage.productHub.header.positionType.shouldBe('Earn');
	});

	(['Borrow', 'Multiply', 'Earn'] as const).forEach((positionCategory) =>
		test(`It should link to ${positionCategory} page - Product hub header`, async ({ app }) => {
			test.info().annotations.push({
				type: 'Test case',
				description: '12334',
			});

			await app.homepage.open();
			await app.homepage.productHub.header.positionType.select(positionCategory);
			await app.homepage.productHub.shouldLinkTo(positionCategory);
		})
	);

	(['Borrow', 'Earn'] as const).forEach((positionType) =>
		test(`It should link to pool finder - ${positionType}`, async ({ app }) => {
			await app.homepage.productHub.header.positionType.select(positionType);
			await app.homepage.productHub.header.positionType.shouldBe(positionType);

			await app.homepage.productHub.list.openPoolFinder();
			await app.poolFinder.shouldHaveHeader(positionType);
		})
	);

	(['Borrow', 'Multiply', 'Earn'] as const).forEach((positionCategory) =>
		test(`It should list only ${positionCategory} pages - Homepage @regression`, async ({
			app,
		}) => {
			test.info().annotations.push({
				type: 'Test case',
				description: '12337',
			});

			test.setTimeout(longTestTimeout);

			await app.homepage.open();
			await app.homepage.productHub.header.positionType.select(positionCategory);

			if (positionCategory === 'Borrow') {
				// Only Borrow positions have Borrow rate in Product hub
				await app.homepage.productHub.list.allPoolsBorrowRateShouldBeGreaterThanZero();
			}
			if (positionCategory === 'Earn') {
				// Only Earn positions have Management in Product hub
				await app.homepage.productHub.list.allPoolsShouldHaveManagement();
			}
			if (positionCategory === 'Multiply') {
				// Only Multiply positions have Max Multiple in Product hub
				await app.homepage.productHub.list.allPoolsMaxMultipleShouldBeGreaterThanZero();
			}
		})
	);

	numberOfPools.forEach((poolIndex) => {
		test(`It should open position page for all available EARN pools - ${poolIndex}`, async ({
			app,
		}) => {
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
						await app.position.overview.shouldBeVisible({
							tab: overviewTabIsVisible ? 'Overview' : 'Position Info',
						}); // default positionTimeout
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

	numberOfPools.forEach((poolIndex) => {
		test(`It should open position page for all available BORROW pools - ${poolIndex}`, async ({
			app,
		}) => {
			await app.homepage.productHub.header.positionType.select('Borrow');
			await app.homepage.productHub.header.positionType.shouldBe('Borrow');

			// Logging pool info for debugging purposes
			const pool = await app.homepage.productHub.list.nthPool(poolIndex).getPool();
			const protocol = await app.homepage.productHub.list.nthPool(poolIndex).getProtocol();
			const network = await app.homepage.productHub.list.nthPool(poolIndex).getNetwork();
			console.log('Pool Index: ', poolIndex);
			console.log('Pool: ', pool);
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

	numberOfPools.forEach((poolIndex) => {
		test(`It should open position page for all available MULTIPLY pools - ${poolIndex}`, async ({
			app,
		}) => {
			await app.homepage.productHub.header.positionType.select('Multiply');
			await app.homepage.productHub.header.positionType.shouldBe('Multiply');

			// Logging pool info for debugging purposes
			const pool = await app.homepage.productHub.list.nthPool(poolIndex).getPool();
			const protocol = await app.homepage.productHub.list.nthPool(poolIndex).getProtocol();
			const network = await app.homepage.productHub.list.nthPool(poolIndex).getNetwork();
			console.log('Pool Index: ', poolIndex);
			console.log('Pool: ', pool);
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
						await app.position.overview.shouldBeVisible(); // default positionTimeout
					} else {
						await app.position.overview.shouldBeVisible({ timeout: 1_000 });
					}
				}).toPass();
			}
		});
	});
});
