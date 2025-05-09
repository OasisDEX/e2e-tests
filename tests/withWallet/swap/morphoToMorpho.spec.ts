import {
	openNewPositionAndSwap,
	Scenario,
	test,
} from 'tests/sharedTestSteps/openNewPositionAndSwap';

(
	[
		{
			pool: 'SUSDE-DAI-1',
			positionType: 'borrow',
			targetPools: [{ colToken: 'WBTC', debtToken: 'USDC' }],
		},
		{
			pool: 'USDE-DAI-1',
			positionType: 'borrow',
			targetPools: [{ colToken: 'WSTETH', debtToken: 'ETH-3' }],
		},
		// {
		// 	pool: 'WSTETH-ETH-3',
		// 	positionType: 'borrow',
		// 	targetPools: [
		// 		// { colToken: 'SUSDE', debtToken: 'DAI-1' }, -- NO LIQUIDITY
		// 		// { colToken: 'SWBTC', debtToken: 'WBTC' }, -- NO LIQUIDITY
		// 		// { colToken: 'USDE', debtToken: 'DAI-2' }, -- Very low liquidity
		// 	],
		// },
		// {
		// 	pool: 'MKR-USDC',
		// 	positionType: 'multiply',
		// 	targetPools: [
		// 		{ colToken: 'WSTETH', debtToken: 'ETH-1' },
		// 		// { colToken: 'SUSDE', debtToken: 'DAI-3' }, -- NO LIQUIDITY
		// 		// { colToken: 'SUSDE', debtToken: 'DAI-4' }, -- NO LIQUIDITY
		// 	],
		// },
	] as Scenario[]
).forEach((scenario) =>
	test.describe('Swap from Morpho to Morpho', async () => {
		await openNewPositionAndSwap({ ...scenario, protocol: 'morphoblue', targetProtocol: 'Morpho' });
	})
);
