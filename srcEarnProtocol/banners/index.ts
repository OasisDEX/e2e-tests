import { Page } from '@playwright/test';
import { Cookies } from './cookies';

export class Banners {
	readonly page: Page;

	readonly cookies: Cookies;

	constructor(page: Page) {
		this.page = page;
		this.cookies = new Cookies(page);
	}
}
