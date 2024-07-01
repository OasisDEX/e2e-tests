import { test } from '@playwright/test';
import { morphoEthereumMultiplyPools_4 } from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoEthereumMultiplyPools_4.forEach((pool) => {
	test.describe('Morpho Blue Multiply - Wallet connected', async () => {
		await openNewPosition({ network: 'ethereum', protocol: 'morphoblue', pool });
	});
});
