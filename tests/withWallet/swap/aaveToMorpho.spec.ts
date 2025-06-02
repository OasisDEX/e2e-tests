import {
	openNewPositionAndSwap,
	Scenario,
	test,
} from 'tests/sharedTestSteps/openNewPositionAndSwap';

(
	[
		{
			pool: 'ETH-USDC',
			positionType: 'borrow',
			targetPools: [
				{ colToken: 'USDE', debtToken: 'DAI-3' },
				{ colToken: 'WBTC', debtToken: 'USDT' },
			],
		},
		{
			pool: 'WBTC-DAI',
			positionType: 'borrow',
			targetPools: [
				// { colToken: 'WSTETH', debtToken: 'ETH-2' },
				{ colToken: 'CBBTC', debtToken: 'USDC' },
			],
		},
		{
			pool: 'ETH-DAI',
			positionType: 'multiply',
			targetPools: [
				{ colToken: 'WSTETH', debtToken: 'USDC' },
				// { colToken: 'EZETH', debtToken: 'ETH' }, --> Low liquidity
				// { colToken: 'OSETH', debtToken: 'ETH' }, --> Low liquidity
			],
		},
		{
			pool: 'USDC-ETH',
			positionType: 'multiply',
			targetPools: [
				{ colToken: 'SUSDE', debtToken: 'DAI-2' },
				{ colToken: 'LBTC', debtToken: 'WBTC' },
			],
		},
		{
			pool: 'WBTC-USDC',
			positionType: 'multiply',
			targetPools: [
				// { colToken: 'WEETH', debtToken: 'ETH' },
				{ colToken: 'WSTETH', debtToken: 'USDT' },
				// { colToken: 'RSETH', debtToken: 'ETH-2' }, --> SKIP temporarily - Bug
			],
		},
	] as Scenario[]
).forEach((scenario) =>
	test.describe('Swap from Aave V3 to Morpho', async () => {
		await openNewPositionAndSwap({ ...scenario, protocol: 'aave/v3', targetProtocol: 'Morpho' });
	})
);
