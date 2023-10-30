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
		await this.open();
		await this.hoverOver(product);
		await expect(
			this.headerLocator.locator(`a:has-text("View all ${product} strategies")`)
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
		await this.hoverOver(product);
		await this.headerLocator.getByText(menuOption).click();
	}
}
