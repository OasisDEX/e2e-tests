import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { veryLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;
let walletAddress: string;

test.describe.configure({ mode: 'serial' });

test.describe('Spark Multiply - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should show History of a Spark Multiply Short position', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxx',
		});

		test.setTimeout(veryLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({ app, network: 'mainnet' }));
			await tenderly.setTokenBalance({
				forkId,
				walletAddress,
				network: 'mainnet',
				token: 'SDAI',
				balance: '50000',
			});
		});

		await tenderly.changeAccountOwner({
			account: '0xb585a1bae38dc735988cc75278aecae786e6a5d6',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/ethereum/spark/multiply/sdai-eth/1448#overview');

		await app.position.openTab('History');
		await app.position.history.openLog('Open Position');
		await app.position.history.shouldHaveLogData([
			{ property: 'Collateral Deposit', value: '4.0000 SDAI' },
			{ property: 'Total collateral', value: '0.00 SDAI 12.93 SDAI' },
			{ property: 'Position debt', value: '0.00 ETH 0.0057 ETH' },
			{ property: 'Loan To Value', value: '0.00% 144.02%' },
			{ property: 'Liquidation price', value: '1,714.84 ETH/SDAI' },
			{ property: 'Multiple', value: '0.00x 3.27x' },
			{ property: 'Net value', value: '0.00 USD4.09 USD' },
			{ property: 'Swapped', value: '0.0057 ETH8.9355 SDAI' },
			{ property: 'Market price', value: '1,566.60 ETH/SDAI' },
			{ property: 'Fees incl. gas', value: '28.93 USD' },
		]);
	});
});
