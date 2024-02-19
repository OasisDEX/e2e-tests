import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { extremelyLongTestTimeout, longTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Ajna Ethereum Earn - Wallet connected', async () => {
	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should open an Ajna Ethereum Earn position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11657',
		});

		test.setTimeout(extremelyLongTestTimeout);

		await test.step('Test setup', async () => {
			({ context } = await metamaskSetUp({ network: 'mainnet' }));
			let page = await context.newPage();
			app = new App(page);

			({ forkId } = await setup({ app, network: 'mainnet' }));
		});

		await app.page.goto('/ethereum/ajna/earn/RETH-ETH#setup');
		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'ETH', amount: '20' });
		await app.position.setup.createSmartDeFiAccount();

		// Smart DeFi Acount creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.createSmartDeFiAccount();
			await test.step('Metamask: ConfirmAddToken', async () => {
				await metamask.confirmAddToken();
			});
			await app.position.setup.continueShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.continue();

		// Position creation randomly fails - Retry until it's created.
		await expect(async () => {
			await app.position.setup.confirmOrRetry();
			await test.step('Metamask: ConfirmPermissionToSpend', async () => {
				await metamask.confirmPermissionToSpend();
			});
			await app.position.setup.goToPositionShouldBeVisible();
		}).toPass({ timeout: longTestTimeout });

		await app.position.setup.goToPosition();
		await app.position.manage.shouldBeVisible('Manage your Ajna Earn Position');
	});

	test('It should allow to simulate an Ajna Ethereum Earn position before opening it', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12105',
		});

		await app.page.goto('/ethereum/ajna/earn/WSTETH-ETH#setup');

		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'ETH', amount: '9.12345' });

		await app.position.overview.shouldHaveProjectedEarnings30days({
			token: 'ETH',
			amount: '0.0[0-9]{3}',
		});

		await app.position.setup.orderInformation.shouldHaveAmountToLend({
			current: '0.00',
			future: '9.[0-9]{4}',
			token: 'ETH',
		});
		await app.position.setup.orderInformation.shouldHaveLendingPrice({
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{4}',
			tokensPair: 'WSTETH/ETH',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{2}',
		});
	});

	test('It should allow to simulate Lending Price adjustment (Up) in an Ajna Ethereum Earn position before opening it - Wallet connected', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12110',
		});

		const initialLendingPrice = await app.position.setup.getLendingPrice();
		const initialMaxLTV = await app.position.setup.getMaxLTV();

		await app.position.setup.showLendingPriceEditor({ pair: 'WSTETH/ETH' });
		await app.position.setup.updateLendingPrice({
			collateralToken: 'ETH',
			adjust: 'up',
		});

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveButtonDisabled('Confirm');
		await app.position.setup.shouldHaveButtonEnabled('Confirm');

		const updatedLendingPrice = await app.position.manage.getLendingPrice();
		const updatedMaxLTV = await app.position.manage.getMaxLTV();
		expect(updatedLendingPrice).toBeGreaterThan(initialLendingPrice);
		expect(updatedMaxLTV).toBeGreaterThan(initialMaxLTV);

		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '0.00',
			future: updatedMaxLTV.toFixed(2),
		});
	});

	test('It should allow to simulate Lending Price adjustment (Down) in an Ajna Ethereum Earn position before opening it', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12109',
		});

		const initialLendingPrice = await app.position.setup.getLendingPrice();
		const initialMaxLTV = await app.position.setup.getMaxLTV();

		await app.position.setup.updateLendingPrice({
			collateralToken: 'ETH',
			adjust: 'down',
		});

		// Wait for simulation to update with new risk
		await app.position.setup.shouldHaveButtonDisabled('Confirm');
		await app.position.setup.shouldHaveButtonEnabled('Confirm');

		const updatedLendingPrice = await app.position.manage.getLendingPrice();
		const updatedMaxLTV = await app.position.manage.getMaxLTV();
		expect(updatedLendingPrice).toBeLessThan(initialLendingPrice);
		expect(updatedMaxLTV).toBeLessThan(initialMaxLTV);

		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '0.00',
			future: updatedMaxLTV.toFixed(2),
		});
	});
});
