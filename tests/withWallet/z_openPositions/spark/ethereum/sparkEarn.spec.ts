import { sparkEthereumEarnPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

sparkEthereumEarnPools.forEach(async (pool) => {
	test.describe('Morpho Ethereum Earn', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'spark',
			pool,
			positionType: 'multiply',
		});
	});
});
