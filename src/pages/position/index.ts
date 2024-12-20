import { expect, Page } from '@playwright/test';
import { expectDefaultTimeout, positionTimeout } from 'utils/config';
import { step } from '#noWalletFixtures';
import { History } from './history';
import { Manage } from './manage';
import { Optimization } from './optimization';
import { OrderInformation } from './orderInformation';
import { Overview } from './overview';
import { Protection } from './protection';
import { Swap } from './swap';
import { Setup } from './setup';

export class Position {
	readonly page: Page;

	readonly history: History;

	readonly manage: Manage;

	readonly optimization: Optimization;

	readonly orderInformation: OrderInformation;

	readonly overview: Overview;

	readonly protection: Protection;

	readonly swap: Swap;

	readonly setup: Setup;

	constructor(page: Page) {
		this.page = page;
		this.history = new History(page);
		this.manage = new Manage(page);
		this.optimization = new Optimization(page);
		this.orderInformation = new OrderInformation(page);
		this.overview = new Overview(page);
		this.protection = new Protection(page);
		this.swap = new Swap(page);
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
					timeout: expectDefaultTimeout * 5,
				});
			}
		}, 'It should open position page').toPass();
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

	@step
	async getAPY() {
		const apyText = await this.page
			.getByText('7 Day APY')
			.locator('xpath=//following-sibling::span[1]')
			.innerText();
		const apy = parseFloat(apyText.replace('%', ''));
		return apy;
	}
}
