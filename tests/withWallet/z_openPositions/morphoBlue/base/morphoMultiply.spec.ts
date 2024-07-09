import { test } from '@playwright/test';
import { morphoBaseMultiplyPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoBaseMultiplyPools.forEach((pool) => {
	test.describe('Morpho Blue Multiply - Wallet connected', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'morphoblue',
			pool,
			positionType: 'multiply',
		});
	});
});
