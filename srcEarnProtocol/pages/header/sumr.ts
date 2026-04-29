import { expect, step } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';

export class Sumr {
	readonly page: Page;

	readonly sumrLocator: Locator;

	constructor(page: Page, headerLocator: Locator) {
		this.page = page;
		this.sumrLocator = headerLocator.getByRole('listitem').filter({ hasText: '$SUMR' });
	}

	@step
	async shouldBeVisible() {
		await expect(this.sumrLocator).toBeVisible();
	}

	@step
	async open() {
		await this.sumrLocator.hover();
	}

	@step
	async select(option: '$SUMR token' | 'SUMR staking') {
		await this.sumrLocator.locator(`a:has-text("${option}")`).click();
	}

	@step
	async shouldHave(options: ('Lazy Summer Forum' | 'Lazy Summer Governance')[]) {
		const hrefValue = {
			'Lazy Summer Forum': 'https://forum.summer.fi/',
			'Lazy Summer Governance': 'https://gov.summer.fi/dao',
		};

		for (const option in options) {
			await expect(
				this.sumrLocator.getByText(options[option]),
				`"${options[option]}" should be visible`,
			).toBeVisible();
			await expect(
				this.sumrLocator.locator(`a:has-text("${options[option]}")`),
				`"${options[option]}" should have "target=_blank" attribute`,
			).toHaveAttribute('target', '_blank');
			await expect(
				this.sumrLocator.locator(`a:has-text("${options[option]}")`),
				`"${options[option]}" should have "href" attribute`,
			).toHaveAttribute('href', hrefValue[options[option]]);
		}
	}
}
