import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';

type Tabs = 'Rebalance mechanism' | 'Governance';

type Strategies = 'Aave V3' | 'Fluid' | 'Morpho Steakhouse' | 'Sky' | 'Spark' | 'Summer';

export class HowItWorks {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldHaveHeader(
		header:
			| 'How it all works'
			| 'Higher Risk Historical Yields'
			| 'Lower Risk Historical Yields'
			| 'Security',
		args?: { timeout: number }
	) {
		await expect(
			this.page.getByRole('heading', { name: header }),
			`"${header}" header should be visible`
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async shouldLinkToLitePaper() {
		await expect(this.page.locator('a:has-text("Lite Paper")')).toHaveAttribute(
			'href',
			'https://docs.summer.fi/lazy-summer-protocol/lazy-summer-protocol'
		);
		await expect(this.page.locator('a:has-text("Lite Paper")')).toHaveAttribute('target', '_blank');
	}

	@step
	async selectTab(tab: Tabs) {
		await this.page.locator(`button:has-text("${tab}")`).click();
	}

	@step
	async shouldHaveTabActive(tab: Tabs) {
		await expect(this.page.locator(`button:has-text("${tab}")`)).toHaveClass(/active/);
	}

	@step
	async shouldHaveImage(altText: 'how-it-works' | 'governance') {
		await expect(
			this.page.locator(`img[alt="${altText}"]`),
			'"how-it-wors" image should be visible'
		).toBeVisible();
	}

	@step
	async toggleStrategy(strategy: Strategies) {}
}
