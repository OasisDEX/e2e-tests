import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { RiskLevels, RiskManagementTypes } from 'srcEarnProtocol/utils/types';
import { Preview } from './preview';

export class Dca {
	readonly page: Page;

	readonly conditionBlockLocator: Locator;

	readonly preview: Preview;

	readonly startingVaultBlockLocator: Locator;

	readonly targetVaultBlockLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.conditionBlockLocator = page.locator('[class*="dca_conditionCardContent_"]');
		this.preview = new Preview(page);
		this.startingVaultBlockLocator = page
			.locator('[class*="dca_vaultDropdownWrapperFrom_"]')
			.first();
		this.targetVaultBlockLocator = page.locator('[class*="dca_vaultDropdownWrapperTo_"]').first();
	}

	@step
	async shouldBeVisible() {
		await expect(this.page.getByRole('heading', { name: 'Create DCA Strategy' })).toBeVisible();
	}

	@step
	async openPage() {
		await expect(async () => {
			await this.page.goto('/earn/dca/new');
			await this.shouldBeVisible();
		}).toPass();
	}

	@step
	async selectNetwork(network: 'Base' | 'Ethereum') {
		await this.page.locator('[class*="_pill_"]').filter({ hasText: network }).click();
	}

	@step
	async shouldHaveNetworkSelected(network: 'Base' | 'Ethereum') {
		await expect(this.page.locator('[class*="_pill_"]').filter({ hasText: network })).toHaveClass(
			/selected/,
		);
	}

	@step
	async openStartingVaultDropdown() {
		await this.startingVaultBlockLocator.click();
	}

	@step
	async openTargetVaultDropdown() {
		await this.targetVaultBlockLocator.click();
	}

	@step
	async shouldHaveVaultDropdownOpened(vault: 'starting' | 'target') {
		const dropdownLocator = {
			starting: this.startingVaultBlockLocator,
			target: this.targetVaultBlockLocator,
		};

		await expect(dropdownLocator[vault].locator('[class*="_dropdownOptions_"]')).toHaveClass(
			/dropdownShow/,
		);
		await expect(dropdownLocator[vault].locator('[class*="_dropdownOptions_"]')).toBeVisible();
	}

	@step
	async selectVault({
		type,
		riskManagementType,
		token,
		riskLevel,
	}: {
		type: 'Starting' | 'Target';
		riskManagementType?: RiskManagementTypes;
		token: 'ETH' | 'USDC' | 'USDT';
		riskLevel?: RiskLevels;
	}) {
		const optionLocator = (
			type === 'Starting' ? this.startingVaultBlockLocator : this.targetVaultBlockLocator
		)
			.locator('[class*="_dropdownOption_"]')
			.filter({ hasText: token })
			.filter({ hasText: riskLevel ?? '' });

		const optionDuplicated = (await optionLocator.count()) > 1;

		await optionLocator
			.nth(!optionDuplicated || riskManagementType === 'DAO Risk-Managed' ? 0 : 1)
			.click();
	}

	@step
	async vaultShouldBe({
		type,
		riskManagementType,
		token,
		riskLevel,
	}: {
		type: 'Starting' | 'Target';
		riskManagementType?: RiskManagementTypes;
		token: 'ETH' | 'USDC' | 'USDT';
		riskLevel?: RiskLevels;
	}) {
		const regExp = new RegExp(
			`${token}.*${riskLevel}.*${riskManagementType === 'Risk-Managed by BlockAnalitica' ? 'Risk-Managed.*by.*Block.*Analitica' : 'DAO.*Risk-Managed'}`,
		);

		await expect(
			(type === 'Starting' ? this.startingVaultBlockLocator : this.targetVaultBlockLocator).locator(
				'[class*="_dropdownSelected_"]',
			),
		).toContainText(regExp);
	}

	@step
	async selectFrequency(frequency: 'Daily' | 'Weekly' | 'Monthly') {
		await this.page.getByRole('button', { name: frequency }).click();
	}

	@step
	async shouldHaveFrequencySelected(frequency: 'Daily' | 'Weekly' | 'Monthly') {
		await expect(this.page.getByRole('button', { name: frequency })).toHaveClass(
			/_frequencyCardActive_/,
		);
	}

	@step
	async enterAmount(amount: string) {
		await this.page
			.locator('[class*="dca_amountInputsColumn_"]')
			.locator('input')
			.first()
			.fill(amount);
	}

	@step
	async enterCustomFrequency(days: string) {
		await this.page.locator('input[id="dca-frequency-days-input"]').fill(days);
	}

	@step
	async shouldHaveKpiCards(
		cards: {
			frequency: '7 days' | '30 days' | '90 days' | '180 days' | '1 year' | '2 years' | '3 years';
			spend: string;
			accumulate: string;
			executions: string;
		}[],
	) {
		for (const card of cards) {
			const spendRegExp = new RegExp(`Spend.*${card.spend}`);
			const accumulateRegExp = new RegExp(`Accumulate.*${card.accumulate}`);
			const executionsRegExp = new RegExp(
				`${card.executions}.*execution${card.executions === '1' ? '' : 's'}`,
			);

			const cardLocator = this.page
				.locator('[class*="dca_kpiCard_"]')
				.filter({ hasText: card.frequency })
				.filter({ hasText: spendRegExp })
				.filter({ hasText: accumulateRegExp })
				.filter({ hasText: executionsRegExp });

			await expect(cardLocator).toBeVisible();
		}
	}

	@step
	async previewDcaStrategy() {
		await this.page.getByRole('button', { name: 'Preview DCA Strategy' }).click();
	}

	@step
	async connectWallet() {
		await this.page.getByRole('button', { name: 'Connect Wallet' }).click();
	}

	@step
	async priceLimit(price: string) {
		await this.conditionBlockLocator
			.filter({ hasText: 'Skip executions when' })
			.locator('input')
			.fill(price);
	}

	@step
	async maxNumberOfTrades(numberOfTrades: string) {
		await this.conditionBlockLocator
			.filter({ hasText: 'Max. Number of Trades' })
			.locator('input')
			.fill(numberOfTrades);
	}

	@step
	async tradeUntil(date: string) {
		await this.conditionBlockLocator
			.filter({ hasText: 'Only trade until' })
			.locator('input')
			.fill(date);
	}

	@step
	async agreeAndSign() {
		await this.page.getByRole('button', { name: 'Agree and sign' }).click();
	}
}
