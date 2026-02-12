import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';
import { FeedbackTypes } from 'srcInstitutions/utils/types';

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
	async shouldHaveFeedbackLogs(logs: { type: FeedbackTypes; reporter: string; subject: string }[]) {
		for (const log of logs) {
			const regExp = new RegExp(
				`.*[new|in-progess|resolved|closed].*${log.type.toLowerCase()}.*${log.reporter}.*${log.subject}`,
			);

			await expect(
				this.page.locator('[class*="_ticketCard_"]').filter({ hasText: regExp }),
				`Should list: ${log.type} - ${log.reporter} - ${log.subject}`,
			).toBeVisible();
		}
	}

	@step
	async selectFeedbackType(type: FeedbackTypes) {
		const pillLocator = this.page
			.locator('[class*="_pillContainer_"]')
			.getByText(type, { exact: true })
			.locator('..');

		await pillLocator.click();

		await expect(pillLocator).toHaveClass(/selected/);
	}

	@step
	async typeFeedback(feedback: string) {
		await this.page.locator('[class*="FeedbackModal"]').getByRole('textbox').fill(feedback);
	}

	@step
	async shouldHaveSubmitButtonEnabled() {
		const labelRegExp = new RegExp(`Submit [question|bug|feature request]`);
		await expect(
			this.page.locator('[class*="FeedbackModal"]').getByRole('button', { name: labelRegExp }),
		).not.toHaveAttribute('disabled');
	}
}
