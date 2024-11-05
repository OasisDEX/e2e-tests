import {
	aaveV3EthereumEarnPools_1,
	aaveV3EthereumEarnPools_2,
	aaveV3EthereumEarnPools_3,
	aaveV3EthereumEarnPools_4,
} from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3EthereumEarnPools_1.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});

aaveV3EthereumEarnPools_2.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});
aaveV3EthereumEarnPools_3.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});

aaveV3EthereumEarnPools_4.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});
