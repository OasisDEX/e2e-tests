import { expect, Page, test } from '@playwright/test';
import { longTestTimeout, positionTimeout } from 'utils/config';
import * as tx from 'utils/tx';
import { step } from '#noWalletFixtures';
import { Manage } from './manage';
import { Optimization } from './optimization';
import { OrderInformation } from './orderInformation';
import { Overview } from './overview';
import { Protection } from './protection';
import { Setup } from './setup';

export class Position {
	readonly page: Page;

	readonly manage: Manage;

	readonly optimization: Optimization;

	readonly orderInformation: OrderInformation;

	readonly overview: Overview;

	readonly protection: Protection;

	readonly setup: Setup;

	constructor(page: Page) {
		this.page = page;
		this.manage = new Manage(page);
		this.optimization = new Optimization(page);
		this.orderInformation = new OrderInformation(page);
		this.overview = new Overview(page);
		this, (this.protection = new Protection(page));
		this.setup = new Setup(page);
	}

	@step
	async shouldHaveHeader(text: string) {
		await expect(this.page.locator('h1 > div').nth(0)).toContainText(text, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveTab(text: string) {
		await expect(this.page.getByRole('button', { name: text })).toBeVisible({
			timeout: positionTimeout,
		});
	}

	@step
	async openTab(tab: string) {
		await this.page.getByRole('button', { name: tab }).click();
	}

	@step
	async openNewMultiplyPosition({
		forkId,
		deposit,
	}: {
		forkId: string;
		deposit: { token: string; amount: string };
	}) {
		const { token, amount } = deposit;
		// await this.setup.deposit({ token: 'WSTETH', amount: '70' });
		await this.setup.deposit({ token, amount });
		await this.setup.createSmartDeFiAccount();

		// Smart DeFi Acount creation randomly fails - Retry until it's created.
		await test.step('Confirm Smart DeFi account and verify tx success', async () => {
			await expect(async () => {
				await this.setup.createSmartDeFiAccount();
				await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmAddToken', forkId });
				await this.setup.continueShouldBeVisible();
			}).toPass({ timeout: longTestTimeout });
		});

		await this.setup.continue();

		// Setting up allowance randomly fails - Retry until it's set.
		await test.step('Approve allowance and verify tx success', async () => {
			await expect(async () => {
				await this.setup.approveAllowance();
				await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmAddToken', forkId });
				await this.setup.continueShouldBeVisible();
			}).toPass({ timeout: longTestTimeout });
		});

		await this.setup.continue();

		// Position creation randomly fails - Retry until it's created.
		await expect(async () => {
			await this.setup.confirmOrRetry();
			await tx.confirmAndVerifySuccess({ metamaskAction: 'confirmPermissionToSpend', forkId });
			await this.setup.shouldShowCreatingPosition();
		}).toPass({ timeout: longTestTimeout });

		// UI sometimes gets stuck after confirming position creation
		//   - 'Reload' added to avoid flakines
		await this.page.reload();
	}

	@step
	async adjustRiskOnExistingMultiplyPosition({
		protocol,
		forkId,
		newSliderPosition,
	}: {
		protocol: 'Ajna' | 'Morpho';
		forkId: string;
		newSliderPosition: number;
	}) {
		await this.setup.moveSlider({ protocol, value: newSliderPosition });

		await this.manage.confirm();

		// UI sometimes gets stuck after confirming position creation
		//   - 'Reload' added to avoid flakines
		await this.setup.confirm();
		await tx.confirmAndVerifySuccess({ forkId, metamaskAction: 'confirmPermissionToSpend' });
		await this.setup.shouldShowUpdatingPosition();

		await this.page.reload();
	}

	@step
	async adjustRiskOnExistingMultiplyPosition_UP({
		protocol,
		forkId,
		newSliderPosition,
	}: {
		protocol: 'Ajna' | 'Morpho';
		forkId: string;
		newSliderPosition: number;
	}) {
		const initialLiqPrice = await this.manage.getLiquidationPrice();
		const initialLoanToValue = await this.manage.getLoanToValue();

		await this.adjustRiskOnExistingMultiplyPosition({ protocol, forkId, newSliderPosition });

		// Wait for Liq price to update
		await expect(async () => {
			const updatedLiqPrice = await this.manage.getLiquidationPrice();
			const updatedLoanToValue = await this.manage.getLoanToValue();
			expect(updatedLiqPrice).toBeGreaterThan(initialLiqPrice);
			expect(updatedLoanToValue).toBeGreaterThan(initialLoanToValue);
		}, 'New Liq. Price and LTV should be higher than original ones').toPass();
	}

	@step
	async adjustRiskOnExistingMultiplyPosition_DOWN({
		protocol,
		forkId,
		newSliderPosition,
	}: {
		protocol: 'Ajna' | 'Morpho';
		forkId: string;
		newSliderPosition: number;
	}) {
		const initialLiqPrice = await this.manage.getLiquidationPrice();
		const initialLoanToValue = await this.manage.getLoanToValue();

		await this.adjustRiskOnExistingMultiplyPosition({ protocol, forkId, newSliderPosition });

		// Wait for Liq price to update
		await expect(async () => {
			const updatedLiqPrice = await this.manage.getLiquidationPrice();
			const updatedLoanToValue = await this.manage.getLoanToValue();
			expect(updatedLiqPrice).toBeLessThan(initialLiqPrice);
			expect(updatedLoanToValue).toBeLessThan(initialLoanToValue);
		}, 'New Liq. Price and LTV should be lower than original ones').toPass();
	}
}
