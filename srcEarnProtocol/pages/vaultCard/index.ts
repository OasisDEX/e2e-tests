import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';
import { Header } from './header';

export class VaultCard {
	readonly page: Page;

	readonly header: Header;

	readonly cardLocator: Locator;

	constructor(page: Page, cardLocator: Locator) {
		this.page = page;
		this.cardLocator = cardLocator;
		this.header = new Header(page, cardLocator);
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(this.cardLocator).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async shouldNotBeVisible(args?: { timeout: number }) {
		await expect(this.cardLocator).not.toBeVisible({
			timeout: args?.timeout ?? expectDefaultTimeout,
		});
	}

	@step
	async select(args?: { delay: number }) {
		await expect(this.cardLocator).toBeVisible();
		await this.cardLocator.click({ delay: args?.delay ?? 0 });
	}

	@step
	async shouldBeSelected() {
		await expect(this.cardLocator).toHaveClass(/selected/i);
	}

	@step
	async getRiskManagementType(): Promise<string> {
		const riskManagementType = await this.cardLocator
			.getByText('Risk Management', { exact: true })
			.locator('..')
			.innerText();
		return riskManagementType;
	}

	@step
	async shouldHave(
		features: ('Minimum Deposit' | 'Curated By')[] | ('Deposit cap' | 'Risk Management')[],
	) {
		for (const feature of features) {
			await expect(this.cardLocator).toContainText(feature);
		}
	}
}
