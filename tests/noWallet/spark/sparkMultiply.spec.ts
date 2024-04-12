import { test } from '#noWalletFixtures';

test.describe('Spark Multiply', async () => {
	test('It should show History ("Open position" event) of a Spark Multiply Short position @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		await app.position.openPage('/ethereum/spark/multiply/sdai-eth/1448#history');

		await app.position.history.openLog('Open Position');
		await app.position.history.shouldHaveLogData([
			{ name: 'Collateral Deposit', value: '4.0000 SDAI' },
			{ name: 'Total collateral', value: '0.00 SDAI 12.93 SDAI' },
			{ name: 'Position debt', value: '0.00 ETH 0.0057 ETH' },
			{ name: 'Loan To Value', value: '0.00% 144.02%' },
			{ name: 'Liquidation price', value: '1,714.84 ETH/SDAI' },
			{ name: 'Multiple', value: '0.00x 3.27x' },
			{ name: 'Net value', value: '0.00 USD4.09 USD' },
			{ name: 'Swapped', value: '0.0057 ETH8.9355 SDAI' },
			{ name: 'Market price', value: '1,566.60 ETH/SDAI' },
			{ name: 'Fees incl. gas', value: '28.93 USD' },
			{
				name: 'View on Etherscan',
				value:
					'https://etherscan.io/tx/0x9cd32dda314f38644c3e101cab6edc5674cdd928708a742ff3981e8484ddf9d4',
			},
		]);
	});

	test('It should show History ("Open position" event) of a Spark Multiply Long position @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		await app.position.openPage('/ethereum/spark/multiply/ETH-DAI/1975#history');

		await app.position.history.openLog('Open Position');
		await app.position.history.shouldHaveLogData([
			{ name: 'Collateral Deposit', value: '0.1000 ETH' },
			{ name: 'Total collateral', value: '0.00 ETH 0.1000 ETH' },
			{ name: 'Position debt', value: '0.00 DAI 50.00 DAI' },
			{ name: 'Loan To Value', value: '0.00% 15.28%' },
			{ name: 'Liquidation price', value: '606.06 ETH/DAI' },
			{ name: 'Multiple', value: '0.00x 1.18x' },
			{ name: 'Net value', value: '0.00 USD277.23 USD' },
			{ name: 'Market price', value: '3,274.71 ETH/DAI' },
			{ name: 'Fees incl. gas', value: '164.76 USD' },
			{
				name: 'View on Etherscan',
				value:
					'https://etherscan.io/tx/0x9f4eb79c6e2bbdb1cdf55a8436053203713edd2409e90014261256a7e35efc4e',
			},
		]);
	});

	test('It should show History ("Borrow" event) of a Spark Multiply Long position @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		await app.position.openPage('/ethereum/spark/multiply/ETH-DAI/1975#history');

		await app.position.history.openLog('Borrow');
		await app.position.history.shouldHaveLogData([
			{ name: 'Collateral Deposit', value: '0.00 ETH' },
			{ name: 'Total collateral', value: '0.1000 ETH 0.1000 ETH' },
			{ name: 'Position debt', value: '50.00 DAI 150.00 DAI' },
			{ name: 'Loan To Value', value: '15.28% 45.84%' },
			{ name: 'Liquidation price', value: '1,818.18 ETH/DAI' },
			{ name: 'Multiple', value: '1.18x 1.85x' },
			{ name: 'Net value', value: '277.23 USD177.32 USD' },
			{ name: 'Market price', value: '3,274.71 ETH/DAI' },
			{ name: 'Fees incl. gas', value: '75.66 USD' },
			{
				name: 'View on Etherscan',
				value:
					'https://etherscan.io/tx/0xdf4e0d41277ecb5433ad55e0a2b044a4908e4a639a20763478974d7e7bd191b4',
			},
		]);
	});

	test('It should show History ("Migrated from Spark" event) of a Spark Multiply Long position @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		await app.position.openPage('/ethereum/spark/multiply/ETH-DAI/2146#history');

		await app.position.history.openLog('Migrated from Spark into Summer.Fi!');
		await app.position.history.shouldHaveLogData([
			{ name: 'Collateral Deposit', value: '0.1000 ETH' },
			{ name: 'Total collateral', value: '0.1000 ETH 0.1000 ETH' },
			{ name: 'Position debt', value: '100.00 DAI 100.00 DAI' },
			{ name: 'Loan To Value', value: '29.88% 29.88%' },
			{ name: 'Liquidation price', value: '1,212.12 ETH/DAI' },
			{ name: 'Multiple', value: '1.43x 1.43x' },
			{ name: 'Net value', value: '234.68 USD234.68 USD' },
			{ name: 'Market price', value: '3,348.26 ETH/DAI' },
			{ name: 'Fees incl. gas', value: '243.88 USD' },
			{
				name: 'View on Etherscan',
				value:
					'https://etherscan.io/tx/0x715e95fb31c62c55246076a408094f494c72fd644956732016699856bdd758e2',
			},
		]);
	});
});
