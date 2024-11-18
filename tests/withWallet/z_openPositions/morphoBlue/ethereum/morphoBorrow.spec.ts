import { morphoEthereumBorrowPools } from 'utils/testData';
import { openNewPosition, test } from 'tests/sharedTestSteps/openNewPosition';

morphoEthereumBorrowPools.forEach(async (pool) => {
	test.describe('Morpho Ethereum Borrow', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'morphoblue',
			pool,
			positionType: 'borrow',
		});
	});
});
