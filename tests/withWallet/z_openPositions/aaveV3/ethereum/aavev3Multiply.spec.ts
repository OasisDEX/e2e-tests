import {
	aaveV3EthereumMultiplyPools_1,
	aaveV3EthereumMultiplyPools_2,
	aaveV3EthereumMultiplyPools_3,
	aaveV3EthereumMultiplyPools_4,
	aaveV3EthereumMultiplyPools_5,
	aaveV3EthereumMultiplyPools_6,
	aaveV3EthereumMultiplyPools_7,
	aaveV3EthereumMultiplyPools_8,
} from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3EthereumMultiplyPools_1.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});

aaveV3EthereumMultiplyPools_2.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});

aaveV3EthereumMultiplyPools_3.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});

aaveV3EthereumMultiplyPools_4.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});

aaveV3EthereumMultiplyPools_5.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});

aaveV3EthereumMultiplyPools_6.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});

aaveV3EthereumMultiplyPools_7.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});

aaveV3EthereumMultiplyPools_8.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'multiply',
	});
});
