import { expect, step } from '#earnProtocolFixtures';
import { Page } from '@playwright/test';
import { time } from 'console';
import { expectDefaultTimeout } from 'utils/config';

export class BeachClub {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldShowConnectWallet(args?: { timeout: number }) {
		await expect(
			this.page.getByText('Connect your wallet to access the Beach Club page')
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async shouldHaveBeachClubInUrl(args?: { timeout: number }) {
		await expect(async () => {
			const url = this.page.url();
			expect(url).toContain('/earn/portfolio?tab=beach-club');
		}).toPass({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async shouldBeVisible(args?: { timeout: number }) {
		await expect(
			this.page.getByText('Unlock exclusive rewards with Lazy Summer Beach Club'),
			'"Lazy Summer Beach Club" header should be visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });

		await expect(
			this.page.getByText('Refer and earn'),
			'"Refer and earn" header should be visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });

		await expect(
			this.page.getByText('Beach Club Rewards'),
			'"Beach Club Rewards" header should be visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}
}
