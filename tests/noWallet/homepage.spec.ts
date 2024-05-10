import { test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

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
		test(`It should link to pool finder - ${positionType} @regression`, async ({ app }) => {
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
		test(`It should open position page for all available EARN pools - ${poolIndex} @regression`, async ({
			app,
		}) => {
			// Logging pool info for debugging purposes
			const pool = await app.homepage.productHub.list.nthPool(poolIndex).getPool();
			const strategy = await app.homepage.productHub.list.nthPool(poolIndex).getStrategy();
			const protocol = await app.homepage.productHub.list.nthPool(poolIndex).getProtocol();
			const network = await app.homepage.productHub.list.nthPool(poolIndex).getNetwork();
			console.log('++++ Pool Index: ', poolIndex);
			console.log('++++ Pool: ', pool);
			console.log('++++ Strategy: ', strategy);
			console.log('++++ Protocol: ', protocol);
			console.log('++++ Network: ', network);

			await app.homepage.productHub.list.nthPool(poolIndex).shouldBevisible();
			await app.homepage.productHub.list.nthPool(poolIndex).open();

			await app.position.overview.shouldBeVisible();
		});
	});

	numberOfPools.forEach((poolIndex) => {
		test(`It should open position page for all available BORROW pools - ${poolIndex} @regression`, async ({
			app,
		}) => {
			await app.homepage.productHub.header.positionType.select('Borrow');
			await app.homepage.productHub.header.positionType.shouldBe('Borrow');

			// Logging pool info for debugging purposes
			const pool = await app.homepage.productHub.list.nthPool(poolIndex).getPool();
			const protocol = await app.homepage.productHub.list.nthPool(poolIndex).getProtocol();
			const network = await app.homepage.productHub.list.nthPool(poolIndex).getNetwork();
			console.log('++++ Pool Index: ', poolIndex);
			console.log('++++ Pool: ', pool);
			console.log('++++ Protocol: ', protocol);
			console.log('++++ Network: ', network);

			await app.homepage.productHub.list.nthPool(poolIndex).shouldBevisible();
			await app.homepage.productHub.list.nthPool(poolIndex).open();

			await app.position.overview.shouldBeVisible();
		});
	});

	numberOfPools.forEach((poolIndex) => {
		test(`It should open position page for all available MULTIPLY pools - ${poolIndex} @regression`, async ({
			app,
		}) => {
			await app.homepage.productHub.header.positionType.select('Multiply');
			await app.homepage.productHub.header.positionType.shouldBe('Multiply');

			// Logging pool info for debugging purposes
			const pool = await app.homepage.productHub.list.nthPool(poolIndex).getPool();
			const protocol = await app.homepage.productHub.list.nthPool(poolIndex).getProtocol();
			const network = await app.homepage.productHub.list.nthPool(poolIndex).getNetwork();
			console.log('++++ Pool Index: ', poolIndex);
			console.log('++++ Pool: ', pool);
			console.log('++++ Protocol: ', protocol);
			console.log('++++ Network: ', network);

			await app.homepage.productHub.list.nthPool(poolIndex).shouldBevisible();
			await app.homepage.productHub.list.nthPool(poolIndex).open();

			await app.position.overview.shouldBeVisible();
		});
	});
});
