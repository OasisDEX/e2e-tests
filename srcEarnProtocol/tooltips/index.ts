import { Page } from '@playwright/test';
import { NetApy } from './netApy';

export class Tooltips {
	readonly page: Page;

	readonly netApy: NetApy;

	constructor(page: Page) {
		this.page = page;
		this.netApy = new NetApy(page);
	}
}
