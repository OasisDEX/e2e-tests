import { step } from '#noWalletFixtures';
import { expect, Locator, Page } from '@playwright/test';

export class Products {
	readonly page: Page;

	readonly headerLocator: Locator;

	constructor(page: Page, headerLocator: Locator) {
		this.page = page;
		this.headerLocator = headerLocator;
	}

	@step
	async open() {
		await this.headerLocator.getByText('Products').hover();
	}

	@step
	async hoverOver(product: 'Earn' | 'Multiply' | 'Borrow' | 'Swap & Bridge') {
		await this.headerLocator.getByText(product, { exact: true }).nth(0).hover();
	}

	@step
	async shouldLinkTo(product: 'Borrow' | 'Earn' | 'Multiply') {
		const description = {
			Borrow: 'Get liquidity from your crypto assets without selling',
			Earn: 'Earn the best yields on your favourite crypto assets',
			Multiply: 'Get increased exposure to your most valued crypto assets in one transaction',
		};
		await this.open();
		await this.hoverOver(product);
		await expect(
			this.headerLocator.getByRole('link').filter({ hasText: description[product] })
		).toHaveAttribute('href', `/${product.toLocaleLowerCase()}`);
	}

	@step
	async select({
		product,
		menuOption,
	}: {
		product: 'Earn' | 'Multiply' | 'Borrow' | 'Swap & Bridge';
		menuOption: string;
	}) {
		await this.open();
		await expect(this.headerLocator.getByText(product, { exact: true })).toBeVisible();
		await this.hoverOver(product);
		await this.headerLocator.getByText(menuOption).click();
	}
}
