import { expect, step } from '#institutionsWithWalletFixtures';
import { Page } from '@playwright/test';

export class UserAdmin {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('heading', { name: 'Active Users' }),
			'"Active Users" header should be visible',
		).toBeVisible();

		await expect(
			this.page.getByRole('heading', { name: 'Whitelisted users' }),
			'"Whitelisted users" header should be visible',
		).toBeVisible();

		await expect(
			this.page.getByRole('heading', { name: 'Add new user' }),
			'"Add new user" header should be visible',
		).toBeVisible();

		await expect(
			this.page.getByRole('heading', { name: 'Transaction Queue' }),
			'"Transaction Queue" header should be visible',
		).toBeVisible();
	}

	@step
	async shouldHaveActiveUsers(
		users: {
			address: string;
			tvl?: string;
			firstDeposit?: string;
			lastActivity?: string;
		}[],
	) {
		for (const user of users) {
			const userLocator = this.page
				.getByRole('heading', { name: 'Active Users' })
				.locator('..')
				.locator('xpath=//following-sibling::div[1]')
				.getByRole('row')
				.filter({ hasText: user.address });

			await expect(userLocator).toBeVisible();

			if (user.tvl) {
				const regExp = new RegExp(user.tvl);
				await expect(userLocator.getByRole('cell').nth(1)).toContainText(regExp);
			}

			if (user.firstDeposit) {
				await expect(userLocator.getByRole('cell').nth(2)).toContainText(user.firstDeposit);
			}

			if (user.lastActivity) {
				const regExp = new RegExp(user.lastActivity);
				await expect(userLocator.getByRole('cell').nth(3)).toContainText(regExp);
			}
		}
	}

	@step
	async shouldHaveWhitelistedUsers(users: string[]) {
		for (const user of users) {
			await expect(
				this.page
					.getByRole('heading', { name: 'Whitelisted users' })
					.locator('..')
					.locator('xpath=//following-sibling::div[1]')
					.getByRole('row')
					.filter({ hasText: user }),
				`Should list ${user} address`,
			).toBeVisible();
		}
	}
}
