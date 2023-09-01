import { expect, Page } from '@playwright/test';
import { positionSimulationTimeout } from 'utils/config';

export class Manage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async shouldBeVisible() {
		await expect(this.page.getByText('Manage your ')).toBeVisible({
			timeout: positionSimulationTimeout,
		});
	}
}
