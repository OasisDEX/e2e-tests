import {
	morphoEthereumBorrowPools,
	// morphoEthereumBorrowPools_1,
	// morphoEthereumBorrowPools_2,
	// morphoEthereumBorrowPools_3,
	// morphoEthereumBorrowPools_4,
} from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoEthereumBorrowPools.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'morphoblue',
		pool,
		positionType: 'borrow',
	});
});

// morphoEthereumBorrowPools_1.forEach(async (pool) => {
// 	await openNewPosition({
// 		network: 'ethereum',
// 		protocol: 'morphoblue',
// 		pool,
// 		positionType: 'borrow',
// 	});
// });

// morphoEthereumBorrowPools_2.forEach(async (pool) => {
// 	await openNewPosition({
// 		network: 'ethereum',
// 		protocol: 'morphoblue',
// 		pool,
// 		positionType: 'borrow',
// 	});
// });

// morphoEthereumBorrowPools_3.forEach(async (pool) => {
// 	await openNewPosition({
// 		network: 'ethereum',
// 		protocol: 'morphoblue',
// 		pool,
// 		positionType: 'borrow',
// 	});
// });

// morphoEthereumBorrowPools_4.forEach(async (pool) => {
// 	await openNewPosition({
// 		network: 'ethereum',
// 		protocol: 'morphoblue',
// 		pool,
// 		positionType: 'borrow',
// 	});
// });
