import {
	morphoEthereumEarnPools_1,
	morphoEthereumEarnPools_2,
	morphoEthereumEarnPools_3,
	morphoEthereumEarnPools_4,
} from 'utils/testData';
import { openNewPosition } from 'tests/sharedTestSteps/openNewPosition';

morphoEthereumEarnPools_1.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'erc-4626',
		pool,
		positionType: 'earn',
	});
});

morphoEthereumEarnPools_2.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'morphoblue',
		pool,
		positionType: 'multiply',
	});
});

morphoEthereumEarnPools_3.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'morphoblue',
		pool,
		positionType: 'multiply',
	});
});

morphoEthereumEarnPools_4.forEach(async (pool) => {
	await openNewPosition({
		network: 'ethereum',
		protocol: 'morphoblue',
		pool,
		positionType: 'multiply',
	});
});
