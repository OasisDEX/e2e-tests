import {
	aaveV3EthereumBorrowPools_1,
	aaveV3EthereumBorrowPools_2,
	aaveV3EthereumBorrowPools_3,
	aaveV3EthereumBorrowPools_4,
	aaveV3EthereumBorrowPools_5,
	aaveV3EthereumBorrowPools_6,
	aaveV3EthereumBorrowPools_7,
	aaveV3EthereumBorrowPools_8,
} from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

aaveV3EthereumBorrowPools_1.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});

aaveV3EthereumBorrowPools_2.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});

aaveV3EthereumBorrowPools_3.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});

aaveV3EthereumBorrowPools_4.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});

aaveV3EthereumBorrowPools_5.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});

aaveV3EthereumBorrowPools_6.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});

aaveV3EthereumBorrowPools_7.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});

aaveV3EthereumBorrowPools_8.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'aave/v3',
		pool,
		positionType: 'borrow',
	});
});
