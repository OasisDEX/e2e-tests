import { test } from '@playwright/test';
import { morphoEthereumMultiplyPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoEthereumMultiplyPools.forEach((pool) => {
	test.describe('Morpho Blue Multiply - Wallet connected', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'morphoblue',
			pool,
			positionType: 'multiply',
		});
	});
});
