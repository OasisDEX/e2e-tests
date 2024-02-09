import { expect, Page } from '@playwright/test';
import { positionTimeout } from 'utils/config';
import { step } from '#noWalletFixtures';
import { Manage } from './manage';
import { Optimization } from './optimization';
import { OrderInformation } from './orderInformation';
import { Overview } from './overview';
import { Setup } from './setup';

export class Position {
	readonly page: Page;

	readonly manage: Manage;

	readonly optimization: Optimization;

	readonly orderInformation: OrderInformation;

	readonly overview: Overview;

	readonly setup: Setup;

	constructor(page: Page) {
		this.page = page;
		this.manage = new Manage(page);
		this.optimization = new Optimization(page);
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

	@step
	async shouldHaveTab(text: string) {
		await expect(this.page.getByRole('button', { name: text })).toBeVisible({
			timeout: positionTimeout,
		});
	}

	@step
	async openTab(tab: string) {
		await this.page.getByRole('button', { name: tab }).click();
	}
}
