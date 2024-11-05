import { test } from '@playwright/test';
import { morphoEthereumEarnPools_4 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoEthereumEarnPools_4.forEach((pool) => {
	test.describe('Morpho Blue Multiply - Wallet connected', async () => {
		await openNewPosition({
			network: 'ethereum',
			protocol: 'morphoblue',
			pool,
			positionType: 'multiply',
		});
	});
});
