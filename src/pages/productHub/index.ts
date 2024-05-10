import { Locator, Page } from '@playwright/test';
import { Filters } from './filters';
import { Header } from './header';
import { ProductsList } from '../common/productsList';

export class ProductHub {
	readonly productHubLocator: Locator;

	readonly filters: Filters;

	readonly header: Header;

	readonly list: ProductsList;

	constructor(page: Page) {
		this.productHubLocator = page.locator('#product-hub').locator('..');
		this.filters = new Filters(page, this.productHubLocator);
		this.header = new Header(this.productHubLocator);
		this.list = new ProductsList(
			page,
			this.productHubLocator,
			this.productHubLocator.locator('tbody tr[role="link"]')
		);
	}
}
