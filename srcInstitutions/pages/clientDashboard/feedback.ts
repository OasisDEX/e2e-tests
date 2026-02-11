import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';
import { FeedbackType } from 'srcInstitutions/utils/types';

export class Feedback {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async open() {
		await this.page.getByRole('button', { name: 'Feedback' }).click();
	}

	@step
	async shouldBeVisible() {
		await expect(this.page.getByText('Your institution feedback list')).toBeVisible();
	}

	@step
	async shouldHaveFeedbackLogs(logs: { type: FeedbackType; reporter: string; subject: string }[]) {
		for (const log of logs) {
			const regExp = new RegExp(
				`.*[new|in-progess|resolved|closed].*${log.type}.*${log.reporter}.*${log.subject}`,
			);

			await expect(
				this.page.locator('[class*="_ticketCard_"]').filter({ hasText: regExp }),
				`Should list: ${log.type} - ${log.reporter} - ${log.subject}`,
			).toBeVisible();
		}
	}
}
