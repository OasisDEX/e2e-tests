import { step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';

export class RemoveStake {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async approve() {
		await this.page.getByRole('button', { name: 'Approve' }).click();
	}
}
