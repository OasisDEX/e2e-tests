import { BrowserContext, test } from '@playwright/test';
import { expect, metamaskSetUp } from 'utils/setup';
import { resetState } from '@synthetixio/synpress/commands/synpress';
import * as metamask from '@synthetixio/synpress/commands/metamask';
import * as tenderly from 'utils/tenderly';
import { setup } from 'utils/setup';
import { hooksTimeout, extremelyLongTestTimeout, baseUrl, longTestTimeout } from 'utils/config';
import { App } from 'src/app';

let context: BrowserContext;
let app: App;
let forkId: string;

test.describe.configure({ mode: 'serial' });

test.describe('Ajna Ethereum Earn - Wallet connected', async () => {
	test.beforeAll(async () => {
		test.setTimeout(hooksTimeout);

		({ context } = await metamaskSetUp({ network: 'mainnet' }));
		let page = await context.newPage();
		app = new App(page);

		({ forkId } = await setup({ app, network: 'mainnet' }));
	});

	test.afterAll(async () => {
		await tenderly.deleteFork(forkId);

		await app.page.close();

		await context.close();

		await resetState();
	});

	test('It should allow to simulate an Ajna Ethereum Earn position before opening it @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12105',
		});

		await app.page.goto('/ethereum/ajna/earn/CBETH-ETH');

		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'ETH', amount: '9.12345' });

		await app.position.overview.shouldHaveTokenAmount({ amount: '9.1234', token: 'ETH' });
		await app.position.overview.shouldHaveProjectedEarnings30days({
			token: 'ETH',
			amount: '0.0[0-9]{3}',
		});

		await app.position.setup.orderInformation.shouldHaveAmountToLend({
			current: '0.00',
			future: '[0-9]{1,2}.[0-9]{4}',
			token: 'ETH',
		});
		await app.position.setup.orderInformation.shouldHaveNetAPY({
			current: '0.00',
			future: '[0-5].[0-9]{2}',
		});
		await app.position.setup.orderInformation.shouldHaveLendingPrice({
			current: '0.00',
			future: '[0-5].[0-9]{4}',
			tokensPair: 'CBETH/ETH',
		});
		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '0.00',
			future: '[0-9]{2}.[0-9]{2}',
		});
	});

	test('It should allow to simulate risk adjustment (Down) with slider in an Ajna Ethereum Earn position before opening it @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12109',
		});

		await app.page.goto('/ethereum/ajna/earn/WSTETH-ETH');

		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'ETH', amount: '50' });

		const initialLendingPrice = await app.position.setup.getLendingPrice();
		const initialMaxLTV = await app.position.setup.getMaxLTV();

		await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.5 });

		await app.position.setup.shouldHaveButtonDisabled('Create Smart DeFi account');
		await app.position.setup.shouldHaveButtonEnabled('Create Smart DeFi account');

		const updatedLendingPrice = await app.position.manage.getLendingPrice();
		const updatedMaxLTV = await app.position.manage.getMaxLTV();
		expect(updatedLendingPrice).toBeLessThan(initialLendingPrice);
		expect(updatedMaxLTV).toBeLessThan(initialMaxLTV);

		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '0.00',
			future: updatedMaxLTV.toFixed(2),
		});
		await app.position.setup.orderInformation.shouldHaveDepositFee({
			amount: '0.00[0-9]{2}',
			token: 'ETH',
		});
	});

	test('It should allow to simulate risk adjustment (Up) with slider in an Ajna Ethereum Earn position before opening it - Wallet connected @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '12110',
		});

		await app.page.goto('/ethereum/ajna/earn/RETH-ETH');

		await app.position.setup.acknowlegeAjnaInfo();
		await app.position.setup.deposit({ token: 'ETH', amount: '30' });

		const initialLendingPrice = await app.position.setup.getLendingPrice();
		const initialMaxLTV = await app.position.setup.getMaxLTV();

		await app.position.setup.moveSlider({ protocol: 'Ajna', value: 0.5 });

		await app.position.setup.shouldHaveButtonDisabled('Create Smart DeFi account');
		await app.position.setup.shouldHaveButtonEnabled('Create Smart DeFi account');

		const updatedLendingPrice = await app.position.manage.getLendingPrice();
		const updatedMaxLTV = await app.position.manage.getMaxLTV();
		expect(updatedLendingPrice).toBeGreaterThan(initialLendingPrice);
		expect(updatedMaxLTV).toBeGreaterThan(initialMaxLTV);

		await app.position.setup.orderInformation.shouldHaveMaxLTV({
			current: '0.00',
			future: updatedMaxLTV.toFixed(2),
		});
	});

	test('It should open an Ajna Ethereum Earn position @regression', async () => {
		test.info().annotations.push({
			type: 'Test case',
			description: '11657',
		});

		test.skip(baseUrl.includes('staging') || baseUrl.includes('//summer.fi'));

		test.setTimeout(extremelyLongTestTimeout);

		await app.page.goto('/ethereum/ajna/earn/CBETH-ETH');
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
		await app.position.manage.shouldBeVisible('Manage your ');
	});
});
