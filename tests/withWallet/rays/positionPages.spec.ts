import { BrowserContext, test } from '@playwright/test';
import { metamaskSetUp, setup } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as tenderly from 'utils/tenderly';
import { extremelyLongTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let forkId: string;
let walletAddress: string;
let app: App;

test.describe.configure({ mode: 'serial' });

test.describe('Rays - Wallet connected - Position page', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	// TEST TO BE REPLACED/UPDATED - Scenario has been moved to NO_WALLET section
	test('It should show Rays to be earned - Adjust risk UP @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11772',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'arbitrum' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId, walletAddress } = await setup({
				app,
				network: 'arbitrum',
				automationMinNetValueFlags: 'arbitrum:aavev3:0.001',
			}));
		});

		await tenderly.changeAccountOwner({
			account: '0xf0464ef55705e5b5cb3b865d92be5341fe85fbb8',
			newOwner: walletAddress,
			forkId,
		});

		await app.position.openPage('/arbitrum/aave/v3/multiply/eth-dai/1#overview');

		await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.8 });
		await app.position.manage.shouldEarnRays('0.00[0-9]{2}');
	});

	test('It should show Rays to be earned - Adjust risk DOWN @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11772',
		});

		await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.1 });
		await app.position.manage.shouldUpdateEarnRays();
		await app.position.manage.shouldEarnRays('0.000[0-9]');
	});

	test('It should show Rays to be increased - Deposit extra collateral @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11772',
		});

		await app.position.manage.openManageOptions({ currentLabel: 'Adjust' });
		await app.position.manage.select('Manage collateral');
		await app.position.manage.deposit({ token: 'ETH', amount: '10' });
		await app.position.manage.shouldIncreaseRays('[1-5],[0-9]{3}.[0-9]{2}');
	});

	test('It should show Rays to be reduced - Withdraw collateral @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11772',
		});

		await app.position.manage.withdrawCollateral();
		await app.position.manage.withdraw({ token: 'ETH', amount: '0.002' });

		await app.position.manage.shouldReduceRays('0.00[0-9]{2}');
	});

	test('It should show Rays to be increased - Pay back debt @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11772',
		});

		await app.position.manage.openManageOptions({ currentLabel: 'ETH' });
		await app.position.manage.select('Manage debt');
		await app.position.manage.payBack({ token: 'Dai', amount: '1.5' });
		await app.position.manage.shouldIncreaseRays('0.00[0-9]{2}');
	});

	test('It should show Rays to be reduced - Borrow more @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11772',
		});

		await app.position.manage.withdrawDebt();
		await app.position.manage.borrow({ token: 'DAI', amount: '7' });

		await app.position.manage.shouldReduceRays('0.00[0-9]{2}');
	});

	test('It should show Rays to be earned - Close position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11772',
		});

		await app.position.manage.openManageOptions({ currentLabel: 'DAI' });
		await app.position.manage.select('Close position');
		await app.position.manage.shouldEarnRays('0.000[0-9]');
	});
});
