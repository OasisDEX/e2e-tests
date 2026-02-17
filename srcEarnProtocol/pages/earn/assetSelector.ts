import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { AssetsSelectorOptions } from 'srcEarnProtocol/utils/types';
import { expectDefaultTimeout } from 'utils/config';

export class AssetsSelector {
	readonly page: Page;

	readonly assetsLocator: Locator;

	constructor(page: Page) {
		this.page = page;
		this.assetsLocator = page.locator('[class*="filtersGroup"] > div:has-text("All assets")');
	}

	@step
	async open() {
		await expect(async () => {
			// Click on drop down element
			await this.assetsLocator.click({ force: true });

			// Verify dropdown options are visible - Step added to avoid flakiness
			await expect(
				this.assetsLocator.getByRole('button').filter({ hasText: 'All assets (' }),
			).toBeVisible();
		}).toPass({ timeout: expectDefaultTimeout * 2 });
	}

	@step
	async select({ option }: { option: AssetsSelectorOptions }) {
		await this.assetsLocator
			.getByRole(['All assets', 'All stables'].includes(option) ? 'button' : 'listitem')
			.filter({ has: this.page.getByText(option, { exact: option === 'USDC' ? true : false }) })
			.click();

		// Click on 'blank' area to  hide dropdown
		await this.assetsLocator.click({ position: { x: 0, y: 20 } });
	}

	@step
	async shouldBe({ option }: { option: AssetsSelectorOptions }) {
		await expect(
			this.assetsLocator.locator('[class*="mainWrapper"]').filter({ hasText: option }),
		).toBeVisible();
	}
}
