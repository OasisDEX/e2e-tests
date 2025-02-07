import {
	openNewPositionAndSwap,
	Scenario,
	test,
} from 'tests/sharedTestSteps/openNewPositionAndSwap';

(
	[
		{
			pool: 'ETH-DAI',
			positionType: 'borrow',
			targetPools: [{ colToken: 'USDE', debtToken: 'DAI-1' }],
		},
		// NO WEETH liquidity
		// {
		// 	pool: 'WEETH-DAI',
		// 	positionType: 'borrow',
		// 	targetPools: [{ colToken: 'SUSDE', debtToken: 'USDT' }],
		// },
	] as Scenario[]
).forEach((scenario) =>
	test.describe('Swap from Spark to Morpho', async () => {
		await openNewPositionAndSwap({ ...scenario, protocol: 'spark', targetProtocol: 'Morpho' });
	})
);
