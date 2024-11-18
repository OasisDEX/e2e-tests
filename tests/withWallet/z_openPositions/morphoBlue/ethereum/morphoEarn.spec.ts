import { morphoEthereumEarnPools_1, morphoEthereumEarnPools_2 } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

morphoEthereumEarnPools_1.forEach(async (pool) => {
	test.describe('Morpho Ethereum Earn - erc-4626', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'erc-4626',
			pool,
			positionType: 'earn',
		});
	});
});

morphoEthereumEarnPools_2.forEach(async (pool) => {
	test.describe('Morpho Ethereum Earn', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'morphoblue',
			pool,
			positionType: 'multiply',
		});
	});
});
