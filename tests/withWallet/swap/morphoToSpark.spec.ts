import { App } from 'src/app';
import {
	openNewPositionAndSwap,
	Scenario,
	test,
} from 'tests/sharedTestSteps/openNewPositionAndSwap';
import { openPosition, swapPosition } from 'tests/sharedTestSteps/positionManagement';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { setup } from 'utils/setup';
import * as tenderly from 'utils/tenderly';

(
	[
		{
			pool: 'WSTETH-USDT',
			positionType: 'borrow',
			targetPools: [{ colToken: 'RETH', debtToken: 'DAI' }],
		},
	] as Scenario[]
).forEach((scenario) =>
	test.describe('Swap from Morpho to Spark', async () => {
		await openNewPositionAndSwap({ ...scenario, protocol: 'morphoblue', targetProtocol: 'Spark' });
	})
);

test.describe('Swap from Morpho to Spark', async () => {
	let app: App;
	let vtId: string;
	let vtRPC: string;
	let walletAddress: string;

	test.beforeEach(async ({ metamask, page }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);

		({ vtId, vtRPC, walletAddress } = await setup({
			metamask,
			app,
			network: 'mainnet',
		}));

		await tenderly.setTokenBalance({
			vtRPC,
			walletAddress,
			network: 'mainnet',
			token: 'WSTETH',
			balance: '10',
		});
	});

	test.afterEach(async () => {
		await tenderly.deleteFork(vtId);
	});
	test('It should OPEN a Morpho Multiply WSTETH/USDT position & then SWAP it to Spark ETH/DAI', async ({
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.position.openPage(`/ethereum/morphoblue/multiply/WSTETH-USDT#setup`);

		await test.step('Open Morpho position ', async () => {
			// Depositing collateral too quickly after loading page returns wrong simulation results
			await app.position.overview.waitForComponentToBeStable();

			await openPosition({
				metamask,
				app,
				vtId,
				deposit: {
					token: 'WSTETH',
					amount: '3',
				},
			});
		});

		await test.step('Swap to Spark', async () => {
			// Wait an reload to avoid flakiness
			await app.page.waitForTimeout(3000);
			await app.page.reload();
			await app.page.waitForTimeout(2000);

			await swapPosition({
				metamask,
				app,
				vtId,
				reason: 'Switch to higher max Loan To Value',
				originalProtocol: 'Morpho',
				targetProtocol: 'Spark',
				targetPool: { colToken: 'ETH', debtToken: 'DAI' },
				verifyPositions: {
					originalPosition: { type: 'Multiply', collateralToken: 'WSTETH', debtToken: 'USDT' },
					targetPosition: {
						exposure: { amount: '[2-6].[0-9]{2}([0-9]{1,2})?', token: 'ETH' },
						debt: { amount: '([0-9],)?[0-9]{3}.[0-9]{2}', token: 'DAI' },
					},
				},
			});
		});
	});
});
