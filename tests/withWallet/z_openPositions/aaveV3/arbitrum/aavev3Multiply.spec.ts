import {
	aaveV3ArbitrumMultiplyPools_1,
	aaveV3ArbitrumMultiplyPools_2,
	aaveV3ArbitrumMultiplyPools_3,
} from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3ArbitrumMultiplyPools_1.forEach(async (pool) => {
	await openNewPosition({
		network: 'arbitrum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});

aaveV3ArbitrumMultiplyPools_2.forEach(async (pool) => {
	await openNewPosition({
		network: 'arbitrum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});

aaveV3ArbitrumMultiplyPools_3.forEach(async (pool) => {
	await openNewPosition({
		network: 'arbitrum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});
