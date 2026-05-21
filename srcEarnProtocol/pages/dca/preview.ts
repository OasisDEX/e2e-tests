import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { RiskLevels, RiskManagementTypes } from 'srcEarnProtocol/utils/types';

export class Preview {
	readonly page: Page;

	readonly vaultLocator: Locator;

	readonly startingVaultLocator: Locator;

	readonly targetVaultLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.vaultLocator = page.locator('[class*="dca_vaultSelectorCard_"]');
		this.startingVaultLocator = this.vaultLocator.filter({ hasText: 'From' });
		this.targetVaultLocator = this.vaultLocator.filter({ hasText: 'To' });
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Review your DCA strategy' }),
		).toBeVisible();
	}

	@step
	async shouldHave({
		network,
		startingVault,
		targetVault,
		amountPerRun,
		frequencyInDays,
		priceLimit,
		maxNumberOfTrades,
		tradeUntil,
	}: {
		network?: 'Ethereum' | 'Base';
		startingVault?: {
			riskManagementType: RiskManagementTypes;
			token: 'ETH' | 'USDC' | 'USDT';
			riskLevel?: RiskLevels;
		};
		targetVault?: {
			riskManagementType: RiskManagementTypes;
			token: 'ETH' | 'USDC' | 'USDT';
			riskLevel?: RiskLevels;
		};
		amountPerRun?: string;
		frequencyInDays?: string;
		priceLimit?: string;
		maxNumberOfTrades?: string;
		tradeUntil?: string;
	}) {
		if (network) {
			await expect(
				this.startingVaultLocator.locator(`svg[title="earn_network_${network.toLowerCase()}"]`),
			).toBeVisible();

			await expect(
				this.targetVaultLocator.locator(`svg[title="earn_network_${network.toLowerCase()}"]`),
			).toBeVisible();
		}

		if (startingVault) {
			const regExp = new RegExp(
				`${startingVault.token}.*${startingVault.riskLevel}.*${
					startingVault.riskManagementType === 'Risk-Managed by BlockAnalitica'
						? 'Risk-Managed.*by.*Block.*Analitica'
						: 'DAO.*Risk-Managed'
				}`,
			);

			await expect(this.startingVaultLocator).toContainText(regExp);
		}
		if (targetVault) {
			// TODO
		}
		if (amountPerRun) {
			// TODO
		}
		if (frequencyInDays) {
			// TODO
		}
		if (priceLimit) {
			// TODO
		}
		if (maxNumberOfTrades) {
			// TODO
		}
		if (tradeUntil) {
			// TODO
		}
	}
}
