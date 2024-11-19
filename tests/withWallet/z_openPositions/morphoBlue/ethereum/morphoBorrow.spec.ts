import { morphoEthereumBorrowPools } from 'utils/testData';
import { openNewPosition, testEthereum } from 'tests/sharedTestSteps/openNewPosition';

morphoEthereumBorrowPools.forEach(async (pool) => {
	testEthereum.describe('Morpho Ethereum Borrow', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'morphoblue',
			pool,
			positionType: 'borrow',
		});
	});
});
