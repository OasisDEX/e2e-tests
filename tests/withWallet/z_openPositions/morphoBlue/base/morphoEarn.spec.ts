import { test } from '@playwright/test';
import { morphoBaseEarnPools } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoBaseEarnPools.forEach((pool) => {
	test.describe('Morpho Blue Earn - Wallet connected', async () => {
		await openNewPosition({
			network: 'base',
			protocol: 'morphoblue',
			pool,
			positionType: 'multiply',
		});
	});
});
