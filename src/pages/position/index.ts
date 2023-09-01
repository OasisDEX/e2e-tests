import { Page } from '@playwright/test';
import { Manage } from './manage';
import { OrderInformation } from './orderInformation';
import { Overview } from './overview';
import { Setup } from './setup';

export class Position {
	readonly page: Page;

	readonly manage: Manage;

	readonly orderInformation: OrderInformation;

	readonly overview: Overview;

	readonly setup: Setup;

	constructor(page: Page) {
		this.page = page;
		this.manage = new Manage(page);
		this.orderInformation = new OrderInformation(page);
		this.overview = new Overview(page);
		this.setup = new Setup(page);
	}

	// async open() {
	// 	await this.page.goto('/earn');
	// }
}
