import { expect, step } from '#noWalletFixtures';
import { Locator, Page } from '@playwright/test';

export class Support {
	readonly page: Page;

	readonly supportLocator: Locator;

	constructor(page: Page, headerLocator: Locator) {
		this.page = page;
		this.supportLocator = headerLocator.getByRole('listitem').filter({ hasText: 'Support' });
	}

	@step
	async open() {
		await this.supportLocator.hover();
	}

	@step
	async select(option: 'Institutional sales and support') {
		await this.supportLocator.locator(`a:has-text("${option}")`).click();
	}

	@step
	async shouldHave(options: ('Email support' | 'Join the Discord Community')[]) {
		const hrefValue = {
			'Email support': 'mailto:support@summer.fi',
			'Join the Discord Community': 'https://chat.summer.fi',
		};

		for (const option in options) {
			await expect(
				this.supportLocator.getByText(options[option]),
				`"${options[option]}" should be visible`,
			).toBeVisible();

			await expect(
				this.supportLocator.locator(`a:has-text("${options[option]}")`),
				`"${options[option]}" should have "href" attribute`,
			).toHaveAttribute('href', hrefValue[options[option]]);

			if (option === 'Join the Discord Community') {
				await expect(
					this.supportLocator.locator(`a:has-text("${options[option]}")`),
					`"${options[option]}" should have "target=_blank" attribute`,
				).toHaveAttribute('target', '_blank');
			}
		}
	}
}
