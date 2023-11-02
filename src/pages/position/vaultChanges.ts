import { step } from '#noWalletFixtures';
import { expect, Locator, Page } from '@playwright/test';
import { positionTimeout } from 'utils/config';

export class VaultChanges {
	readonly page: Page;

	readonly vaultChangesLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.vaultChangesLocator = page.getByRole('list').filter({ hasText: 'Vault changes' }); // locator('ul:has-text("Order information")');
	}

	@step
	async shouldHaveCollateralLocked({
		token,
		current,
		future,
	}: {
		token: string;
		current: string;
		future: string;
	}) {
		const regExp = new RegExp(`${current} ${token}${future} ${token}`);
		await expect(
			this.vaultChangesLocator.locator('li:has-text("Collateral Locked")')
		).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveAvailableToWithdraw({
		token,
		current,
		future,
	}: {
		token: string;
		current: string;
		future: string;
	}) {
		const regExp = new RegExp(`${current} ${token}${future} ${token}`);

		await expect(
			this.vaultChangesLocator.locator('li:has-text("Available to Withdraw")')
		).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveAvailableToGenerate({
		token,
		current,
		future,
	}: {
		token: string;
		current: string;
		future: string;
	}) {
		const regExp = new RegExp(`${current} ${token}${future} ${token}`);

		await expect(
			this.vaultChangesLocator.locator('li:has-text("Available to Generate")')
		).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveMaxGasFee(amount: string) {
		const regExp = new RegExp(amount);
		await expect(this.vaultChangesLocator.locator('li:has-text("Max gas fee")')).toContainText(
			regExp,
			{
				timeout: positionTimeout,
			}
		);
	}

	@step
	async shouldHaveCollateralizationRatio({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current}%${future}%`);

		await expect(
			this.vaultChangesLocator.locator('li:has-text("Collateralization Ratio")')
		).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveLiquidationPrice({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`\\$${current}\\$${future}`);

		await expect(
			this.vaultChangesLocator.locator('li:has-text("Liquidation Price")')
		).toContainText(regExp, {
			timeout: positionTimeout,
		});
	}

	@step
	async shouldHaveVaultDaiDebt({ current, future }: { current: string; future: string }) {
		const regExp = new RegExp(`${current} DAI${future} DAI`);

		await expect(this.vaultChangesLocator.locator('li:has-text("Vault Dai Debt")')).toContainText(
			regExp,
			{
				timeout: positionTimeout,
			}
		);
	}
}
