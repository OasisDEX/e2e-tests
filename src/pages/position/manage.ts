import { expect, Page } from '@playwright/test';
import { positionSimulationTimeout } from 'utils/config';

export class Manage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async shouldBeVisible(header: string) {
		await expect(this.page.getByText(header)).toBeVisible({
			timeout: positionSimulationTimeout,
		});
	}
}
