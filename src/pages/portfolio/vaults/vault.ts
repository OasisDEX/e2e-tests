import { step } from '#noWalletFixtures';
import { expect, Locator } from '@playwright/test';
import { portfolioTimeout } from 'utils/config';

export class Vault {
	readonly vaultLocator: Locator;

	constructor(vaultLocator: Locator) {
		this.vaultLocator = vaultLocator;
	}

	@step
	async shouldHave(args: { assets?: string }) {
		if (args.assets) {
			await expect(
				this.vaultLocator.getByText('Position').locator('xpath=//preceding::span[1]')
			).toContainText(args.assets, { timeout: portfolioTimeout });
		}
	}

	@step
	async view() {
		await expect(
			this.vaultLocator.getByRole('button', { name: 'View' }),
			'"View" should be visible'
		).toBeVisible({
			timeout: portfolioTimeout,
		});
		await this.vaultLocator.getByRole('button', { name: 'View' }).click();
	}
}
