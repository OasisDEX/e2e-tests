import { Locator, Page } from '@playwright/test';
import { Header } from './header';
import { ProductsList } from '../../common/productsList';

export class ProductHub {
	readonly productHubLocator: Locator;

	readonly header: Header;

	readonly list: ProductsList;

	constructor(page: Page) {
		this.productHubLocator = page.locator('#product-hub').locator('..');
		this.header = new Header(this.productHubLocator);
		this.list = new ProductsList(this.productHubLocator);
	}
}
