import {
	openNewPositionAndSwap,
	Scenario,
	test,
} from 'tests/sharedTestSteps/openNewPositionAndSwap';

(
	[
		{
			pool: 'SDAI-ETH',
			positionType: 'borrow',
			targetPools: [{ colToken: 'WBTC', debtToken: 'ETH' }],
		},
		{
			pool: 'WSTETH-DAI',
			positionType: 'borrow',
			targetPools: [{ colToken: 'WSTETH', debtToken: 'CBETH' }],
		},
		{
			pool: 'RETH-DAI',
			positionType: 'multiply',
			targetPools: [{ colToken: 'USDC', debtToken: 'WBTC' }],
		},
		{
			pool: 'WEETH-DAI',
			positionType: 'multiply',
			targetPools: [{ colToken: 'DAI', debtToken: 'WBTC' }],
		},
	] as Scenario[]
).forEach((scenario) =>
	test.describe('Swap from Spark to Aave V3', async () => {
		await openNewPositionAndSwap({ ...scenario, protocol: 'spark', targetProtocol: 'Aave V3' });
	})
);
