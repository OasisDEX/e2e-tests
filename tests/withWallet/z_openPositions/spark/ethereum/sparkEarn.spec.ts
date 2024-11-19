import { sparkEthereumEarnPools } from 'utils/testData';
import { openNewPosition, testEthereum } from 'tests/sharedTestSteps/openNewPosition';

sparkEthereumEarnPools.forEach(async (pool) => {
	testEthereum.describe('Morpho Ethereum Earn', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'spark',
			pool,
			positionType: 'multiply',
		});
	});
});
