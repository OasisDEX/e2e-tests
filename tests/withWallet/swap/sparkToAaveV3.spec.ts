import {
	openNewPositionAndSwap,
	Scenario,
	test,
} from 'tests/sharedTestSteps/openNewPositionAndSwap';

(
	[
		// NO SDAI liquidity
		// {
		// 	pool: 'SDAI-ETH',
		// 	positionType: 'borrow',
		// 	targetPools: [{ colToken: 'WBTC', debtToken: 'ETH' }],
		// },
		// BUG for swapping to WSTETH/CBETH - https://www.notion.so/oazo/144cbc0395cb478a8b81cff326740123?v=2bb430cfe8ca41ff9f6dde3b129ac0fb&p=1528cbaf47f880e39584dd5c7e56d54f&pm=s
		// {
		// 	pool: 'WSTETH-DAI',
		// 	positionType: 'borrow',
		// 	targetPools: [{ colToken: 'WSTETH', debtToken: 'CBETH' }],
		// },
		{
			pool: 'RETH-DAI',
			positionType: 'multiply',
			targetPools: [{ colToken: 'USDC', debtToken: 'WBTC' }],
		},
		// NO WEETH liquidity
		// {
		// 	pool: 'WEETH-DAI',
		// 	positionType: 'multiply',
		// 	targetPools: [{ colToken: 'DAI', debtToken: 'WBTC' }],
		// },
	] as Scenario[]
).forEach((scenario) =>
	test.describe('Swap from Spark to Aave V3', async () => {
		await openNewPositionAndSwap({ ...scenario, protocol: 'spark', targetProtocol: 'Aave V3' });
	})
);
