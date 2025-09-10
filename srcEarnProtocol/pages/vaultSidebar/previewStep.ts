import { step } from '#earnProtocolFixtures';
import { expect, Page } from '@playwright/test';
import { EarnTokens } from 'srcEarnProtocol/utils/types';
import { expectDefaultTimeout } from 'utils/config';

export class PreviewStep {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async shouldBeVisible({ flow, timeout }: { flow: 'deposit' | 'withdraw'; timeout?: number }) {
		await expect(this.page.getByRole('heading', { name: `Preview ${flow}` })).toBeVisible({
			timeout: timeout ?? expectDefaultTimeout,
		});
	}

	@step
	async shouldHave({
		depositAmount,
		withdrawAmount,
		swap,
		price,
		priceImpact,
		slippage,
		transactionFee,
	}: {
		depositAmount?: { amount: string; token: EarnTokens };
		withdrawAmount?: { amount: string; token: EarnTokens };
		swap?: {
			originalToken: EarnTokens;
			originalTokenAmount: string;
			positionToken: EarnTokens;
			positionTokenAmount: string;
		};
		price?: {
			originalToken: EarnTokens;
			positionToken: EarnTokens;
			amount: string;
		};
		priceImpact?: string;
		slippage?: string;
		transactionFee?: string;
	}) {
		await expect(this.page.getByText('Changes & Fees')).toBeVisible({ timeout: 10_000 });

		if (depositAmount) {
			const regExp = new RegExp(`${depositAmount.amount}.*${depositAmount.token}`);

			await expect(
				this.page.locator(
					`span:has-text("Deposit Amount") + span:has-text("${depositAmount.token}")`
				)
			).toContainText(regExp);
		}

		if (withdrawAmount) {
			const regExp = new RegExp(`${withdrawAmount.amount}.*${withdrawAmount.token}`);

			await expect(
				this.page.locator(
					`span:has-text("Withdraw Amount") + span:has-text("${withdrawAmount.token}")`
				)
			).toContainText(regExp);
		}

		if (swap) {
			const amountsRegExp = new RegExp(`${swap.originalTokenAmount}.*${swap.positionTokenAmount}`);
			await expect(
				this.page.locator('span:has-text("Swap")').locator('xpath=//following-sibling::*[1]')
			).toContainText(amountsRegExp);

			const originalTokenRegExp = new RegExp(swap.originalToken);
			await expect(
				this.page
					.locator('span:has-text("Swap")')
					.locator('xpath=//following-sibling::*[1]')
					.locator('svg')
					.nth(0)
			).toHaveAttribute('title', originalTokenRegExp, { ignoreCase: true });

			const positionTokenRegExp = new RegExp(swap.positionToken);
			await expect(
				this.page
					.locator('span:has-text("Swap")')
					.locator('xpath=//following-sibling::*[1]')
					.locator('svg')
					.nth(1)
			).toHaveAttribute('title', positionTokenRegExp, { ignoreCase: true });
		}

		if (price) {
			const regExp = new RegExp(`${price.amount}.*${price.positionToken}/${price.originalToken}`);

			await expect(
				this.page.locator(`span:has-text("Price") + span:has-text("${price.originalToken}")`)
			).toContainText(regExp);
		}

		if (priceImpact) {
			const regExp = new RegExp(`${priceImpact}%`);

			await expect(
				this.page.locator('span:has-text("Price Impact") + span:has-text("%")')
			).toContainText(regExp);
		}

		if (slippage) {
			const regExp = new RegExp(slippage);

			await expect(
				this.page.locator('span:has-text("Slippage") + span:has-text("%")')
			).toContainText(regExp);
		}

		if (transactionFee) {
			const regExp = new RegExp(`\\$.*${transactionFee}`);

			await expect(
				this.page.locator('span:has-text("Transaction Fee") + span:has-text("$")')
			).toContainText(regExp, { timeout: 10_000 });
		}
	}

	@step
	async deposit() {
		await this.page.getByRole('button', { name: 'Deposit' }).click();
	}

	@step
	async withdraw() {
		await this.page.getByRole('button', { name: 'Withdraw', exact: true }).click();
	}
}
