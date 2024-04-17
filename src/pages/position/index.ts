import { expect, Page } from '@playwright/test';
import { expectDefaultTimeout, positionTimeout } from 'utils/config';
import { step } from '#noWalletFixtures';
import { History } from './history';
import { Manage } from './manage';
import { Optimization } from './optimization';
import { OrderInformation } from './orderInformation';
import { Overview } from './overview';
import { Protection } from './protection';
import { Setup } from './setup';

export class Position {
	readonly page: Page;

	readonly history: History;

	readonly manage: Manage;

	readonly optimization: Optimization;

	readonly orderInformation: OrderInformation;

	readonly overview: Overview;

	readonly protection: Protection;

	readonly setup: Setup;

	constructor(page: Page) {
		this.page = page;
		this.history = new History(page);
		this.manage = new Manage(page);
		this.optimization = new Optimization(page);
		this.orderInformation = new OrderInformation(page);
		this.overview = new Overview(page);
		this.protection = new Protection(page);
		this.setup = new Setup(page);
	}

	@step
	async openPage(
		url: string,
		args?: { tab?: 'Overview' | 'Position Info'; positionType?: 'Maker' }
	) {
		await expect(async () => {
			await this.page.goto(url);
			if (args?.positionType) {
				await this.overview.waitForComponentToBeStable({
					positionType: 'Maker',
					timeout: expectDefaultTimeout * 5,
				});
			} else {
				await this.overview.shouldBeVisible({
					tab: args?.tab ?? 'Position Info',
					timeout: expectDefaultTimeout * 6,
				});
			}
		}).toPass();
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
