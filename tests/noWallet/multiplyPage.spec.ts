import { test } from '#noWalletFixtures';

const numberOfPools = Array.from({ length: 20 }, (_, index) => 0 + index);
const numberOfPoolsPage7 = Array.from({ length: 8 }, (_, index) => 0 + index);

test.describe('Multiply page', async () => {
	numberOfPools.forEach((poolIndex) => {
		test(`It should open position page for all available MULTIPLY pools - Page 1 - ${poolIndex} @regression`, async ({
			app,
		}) => {
			await app.multiply.open();

			// Set Min Liquidity to '0' so that all pools are listed
			await app.multiply.productHub.filters.setMinLiquidity({ value: 0.5 });
			await app.multiply.productHub.filters.setMinLiquidity({ value: 0 });

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

			if (protocol === 'Maker') {
				await app.modals.connectWallet.shouldBeVisible();
			} else {
				await app.position.overview.shouldBeVisible();
			}
		});
	});

	numberOfPools.forEach((poolIndex) => {
		test(`It should open position page for all available MULTIPLY pools - Page 2 - ${poolIndex}`, async ({
			app,
		}) => {
			await app.multiply.open();

			// Set Min Liquidity to '0' so that all pools are listed
			await app.multiply.productHub.filters.setMinLiquidity({ value: 0.5 });
			await app.multiply.productHub.filters.setMinLiquidity({ value: 0 });

			// Move to page 2 inproduct hub
			await app.multiply.productHub.list.nextPage();

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

			if (protocol === 'Maker') {
				await app.modals.connectWallet.shouldBeVisible();
			} else {
				await app.position.overview.shouldBeVisible();
			}
		});
	});

	numberOfPools.forEach((poolIndex) => {
		test(`It should open position page for all available MULTIPLY pools - Page 3 - ${poolIndex}`, async ({
			app,
		}) => {
			await app.multiply.open();

			// Set Min Liquidity to '0' so that all pools are listed
			await app.multiply.productHub.filters.setMinLiquidity({ value: 0.5 });
			await app.multiply.productHub.filters.setMinLiquidity({ value: 0 });

			// Move to page 2 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 3 inproduct hub
			await app.multiply.productHub.list.nextPage();

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

			if (protocol === 'Maker') {
				await app.modals.connectWallet.shouldBeVisible();
			} else {
				await app.position.overview.shouldBeVisible();
			}
		});
	});

	numberOfPools.forEach((poolIndex) => {
		test(`It should open position page for all available MULTIPLY pools - Page 4 - ${poolIndex}`, async ({
			app,
		}) => {
			await app.multiply.open();

			// Set Min Liquidity to '0' so that all pools are listed
			await app.multiply.productHub.filters.setMinLiquidity({ value: 0.5 });
			await app.multiply.productHub.filters.setMinLiquidity({ value: 0 });

			// Move to page 2 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 3 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 4 inproduct hub
			await app.multiply.productHub.list.nextPage();

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

			if (protocol === 'Maker') {
				await app.modals.connectWallet.shouldBeVisible();
			} else {
				await app.position.overview.shouldBeVisible();
			}
		});
	});

	numberOfPools.forEach((poolIndex) => {
		test(`It should open position page for all available MULTIPLY pools - Page 5 - ${poolIndex}`, async ({
			app,
		}) => {
			await app.multiply.open();

			// Set Min Liquidity to '0' so that all pools are listed
			await app.multiply.productHub.filters.setMinLiquidity({ value: 0.5 });
			await app.multiply.productHub.filters.setMinLiquidity({ value: 0 });

			// Move to page 2 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 3 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 4 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 5 inproduct hub
			await app.multiply.productHub.list.nextPage();

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

			if (protocol === 'Maker') {
				await app.modals.connectWallet.shouldBeVisible();
			} else {
				await app.position.overview.shouldBeVisible();
			}
		});
	});

	numberOfPools.forEach((poolIndex) => {
		test(`It should open position page for all available MULTIPLY pools - Page 6 - ${poolIndex}`, async ({
			app,
		}) => {
			await app.multiply.open();

			// Set Min Liquidity to '0' so that all pools are listed
			await app.multiply.productHub.filters.setMinLiquidity({ value: 0.5 });
			await app.multiply.productHub.filters.setMinLiquidity({ value: 0 });

			// Move to page 2 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 3 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 4 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 5 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 6 inproduct hub
			await app.multiply.productHub.list.nextPage();

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

			if (protocol === 'Maker') {
				await app.modals.connectWallet.shouldBeVisible();
			} else {
				await app.position.overview.shouldBeVisible();
			}
		});
	});

	numberOfPoolsPage7.forEach((poolIndex) => {
		test(`It should open position page for all available MULTIPLY pools - Page 7 - ${poolIndex}`, async ({
			app,
		}) => {
			await app.multiply.open();

			// Set Min Liquidity to '0' so that all pools are listed
			await app.multiply.productHub.filters.setMinLiquidity({ value: 0.5 });
			await app.multiply.productHub.filters.setMinLiquidity({ value: 0 });

			// Move to page 2 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 3 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 4 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 5 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 6 inproduct hub
			await app.multiply.productHub.list.nextPage();
			// Move to page 7 inproduct hub
			await app.multiply.productHub.list.nextPage();

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

			if (protocol === 'Maker') {
				await app.modals.connectWallet.shouldBeVisible();
			} else {
				await app.position.overview.shouldBeVisible();
			}
		});
	});
});
