import {
	openNewPositionAndSwap,
	Scenario,
	test,
} from 'tests/sharedTestSteps/openNewPositionAndSwap';

(
	[
		// NO WEETH liquidity
		// {
		// 	pool: 'ETH-DAI',
		// 	positionType: 'borrow',
		// 	targetPools: [{ colToken: 'WEETH', debtToken: 'DAI' }],
		// },
		{
			pool: 'WSTETH-USDC',
			positionType: 'multiply',
			targetPools: [{ colToken: 'WSTETH', debtToken: 'DAI' }],
		},
	] as Scenario[]
).forEach((scenario) =>
	test.describe('Swap from Aave V3 to Spark', async () => {
		await openNewPositionAndSwap({ ...scenario, protocol: 'aave/v3', targetProtocol: 'Spark' });
	})
);
