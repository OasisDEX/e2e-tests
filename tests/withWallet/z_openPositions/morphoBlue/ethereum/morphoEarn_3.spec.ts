import { test } from '@playwright/test';
import { morphoEthereumEarnPools_3 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoEthereumEarnPools_3.forEach((pool) => {
	test.describe('Morpho Blue Multiply - Wallet connected', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'morphoblue',
			pool,
			positionType: 'multiply',
		});
	});
});
