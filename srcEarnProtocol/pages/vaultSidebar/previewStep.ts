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
		withSwap,
		transactionFee,
	}: {
		depositAmount?: { amount: string; token: EarnTokens };
		withdrawAmount?: { amount: string; token: EarnTokens };
		withSwap?: {
			swap: {
				originalToken: EarnTokens;
				originalTokenAmount: string;
				positionToken: EarnTokens;
				positionTokenAmount: string;
			};
			limitPrice: {
				price: string;
				originalToken: EarnTokens;
				positionToken: EarnTokens;
			};
			slippage?: string;
			quoteValidUntil: string;
		};
		transactionFee?: string;
	}) {
		if (withSwap) {
			// Wait for summary info to be displayed
			await expect(this.page.getByText('Swap Quote')).toBeVisible({ timeout: 10_000 });

			// Swap
			const amountsRegExp = new RegExp(
				`${withSwap.swap.originalTokenAmount}.*${withSwap.swap.positionTokenAmount}`,
			);
			await expect(
				this.page.locator('li span:has-text("Swap")').locator('xpath=//following-sibling::*[1]'),
			).toContainText(amountsRegExp);

			const originalTokenRegExp = new RegExp(withSwap.swap.originalToken);
			await expect(
				this.page
					.locator('span:has-text("Swap")')
					.locator('xpath=//following-sibling::*[1]')
					.locator('svg')
					.nth(0),
			).toHaveAttribute('title', originalTokenRegExp, { ignoreCase: true });

			const positionTokenRegExp = new RegExp(withSwap.swap.positionToken);
			await expect(
				this.page
					.locator('span:has-text("Swap")')
					.locator('xpath=//following-sibling::*[1]')
					.locator('svg')
					.nth(1),
			).toHaveAttribute('title', positionTokenRegExp, { ignoreCase: true });

			// Limit price
			const limitPriceRegExp = new RegExp(
				`${withSwap.limitPrice.price}.*${withSwap.limitPrice.positionToken}\\/${withSwap.limitPrice.originalToken}`,
			);
			await expect(
				this.page
					.locator('li span:has-text("Limit price")')
					.locator('xpath=//following-sibling::*[1]'),
			).toContainText(limitPriceRegExp);

			// Slippage
			const slippageRegExp = new RegExp(`${withSwap.slippage}%`);

			await expect(
				this.page.locator('span:has-text("Slippage") + span:has-text("%")'),
			).toContainText(slippageRegExp);

			// Quote Valid Until
			const quoteValidUntilRegExp = new RegExp(withSwap.quoteValidUntil);

			await expect(
				this.page
					.locator('span:has-text("Quote valid until")')
					.locator('xpath=//following-sibling::*[1]'),
			).toContainText(quoteValidUntilRegExp);
		} else {
			await expect(this.page.getByText('Changes & Fees')).toBeVisible({ timeout: 10_000 });

			if (depositAmount) {
				const regExp = new RegExp(`${depositAmount.amount}.*${depositAmount.token}`);

				await expect(
					this.page.locator(
						`span:has-text("Deposit Amount") + span:has-text("${depositAmount.token}")`,
					),
				).toContainText(regExp);
			}

			if (withdrawAmount) {
				const regExp = new RegExp(`${withdrawAmount.amount}.*${withdrawAmount.token}`);

				await expect(
					this.page.locator(
						`span:has-text("Withdraw Amount") + span:has-text("${withdrawAmount.token}")`,
					),
				).toContainText(regExp);
			}

			if (transactionFee) {
				const regExp = new RegExp(`\\$.*${transactionFee}`);

				await expect(
					this.page.locator('span:has-text("Transaction Fee") + span:has-text("$")'),
				).toContainText(regExp, { timeout: 10_000 });
			}
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
