import {
	aaveV3OptimismMultiplyPools_1,
	aaveV3OptimismMultiplyPools_2,
	aaveV3OptimismMultiplyPools_3,
	aaveV3OptimismMultiplyPools_4,
} from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3OptimismMultiplyPools_1.forEach(async (pool) => {
	await openNewPosition({
		network: 'optimism',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});

aaveV3OptimismMultiplyPools_2.forEach(async (pool) => {
	await openNewPosition({
		network: 'optimism',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});

aaveV3OptimismMultiplyPools_3.forEach(async (pool) => {
	await openNewPosition({
		network: 'optimism',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});

aaveV3OptimismMultiplyPools_4.forEach(async (pool) => {
	await openNewPosition({
		network: 'optimism',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});
