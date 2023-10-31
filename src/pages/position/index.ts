import { expect, Page } from '@playwright/test';
import { Manage } from './manage';
import { OrderInformation } from './orderInformation';
import { Overview } from './overview';
import { Setup } from './setup';
import { positionTimeout } from 'utils/config';
import { step } from '#noWalletFixtures';

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

	@step
	async shouldHaveHeader(text: string) {
		await expect(this.page.locator('h1 > div').nth(0)).toContainText(text, {
			timeout: positionTimeout,
		});
	}
}
