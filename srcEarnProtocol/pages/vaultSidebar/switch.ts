import { expect } from '#earnProtocolFixtures';
import { step } from '#noWalletFixtures';
import { Page } from '@playwright/test';
import { EarnTokens, LazyNominatedTokens, Risks } from 'srcEarnProtocol/utils/types';

export class Switch {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async yourPositionShouldBe({
		network,
		token,
		risk,
		balance,
		liveAPY,
	}: {
		network?: 'arbitrum' | 'base' | 'ethereum';
		token?: EarnTokens;
		risk?: Risks;
		balance?: string;
		liveAPY?: string;
	}) {
		const positionLocator = this.page.locator('[class*="_cardWrapper_"]:has-text("Balance")');

		if (network) {
			await expect(positionLocator.getByTestId('vault-network').locator('svg')).toHaveAttribute(
				'title',
				`earn_network_${network}`
			);
		}

		if (token) {
			await expect(positionLocator.getByTestId('vault-token')).toHaveText(token);
		}

		if (risk) {
			await expect(positionLocator.locator('[class*="_titleRow_"]')).toContainText(risk);
		}

		if (balance) {
			const regExp = new RegExp(`${balance}.*${token === 'ETH' ? 'WETH' : token}`);
			await expect(positionLocator.getByText('Balance').locator('..')).toContainText(regExp);
		}

		if (liveAPY) {
			const regExp = new RegExp(`${liveAPY}%`);
			await expect(positionLocator.getByText('Live APY').locator('..')).toContainText(regExp);
		}
	}

	@step
	async targetPositionsShouldBe(
		targetPositions: {
			network?: 'arbitrum' | 'base' | 'ethereum';
			token?: EarnTokens;
			risk?: Risks;
			thirtyDayAPY?: string;
			liveAPY?: string;
			apySpread?: string;
		}[]
	) {
		for (const targetPosition of targetPositions) {
			const regExp = new RegExp(`${targetPosition.token}.*${targetPosition.risk ?? ''}`);
			const positionLocator = this.page
				.locator('[class*="_cardWrapper_"]:has-text("Live APY")')
				.filter({ hasText: regExp });

			if (targetPosition.network) {
				await expect(positionLocator.getByTestId('vault-network').locator('svg')).toHaveAttribute(
					'title',
					`earn_network_${targetPosition.network}`
				);
			}

			if (targetPosition.token) {
				await expect(positionLocator.getByTestId('vault-token')).toHaveText(targetPosition.token);
			}

			if (targetPosition.risk) {
				await expect(positionLocator.locator('[class*="_titleRow_"]')).toContainText(
					targetPosition.risk
				);
			}

			if (targetPosition.thirtyDayAPY) {
				const regExp = new RegExp(`${targetPosition.thirtyDayAPY}%`);
				await expect(positionLocator.getByText('30d APY').locator('..')).toContainText(regExp);
			}

			if (targetPosition.liveAPY) {
				const regExp = new RegExp(`${targetPosition.liveAPY}%`);
				await expect(positionLocator.getByText('Live APY').locator('..')).toContainText(regExp);
			}

			if (targetPosition.apySpread) {
				const regExp = new RegExp(`${targetPosition.apySpread}%`);
				await expect(positionLocator.getByText('APY Spread:')).toContainText(regExp);
			}
		}
	}

	@step
	async selectTargetPosition(position: { token: LazyNominatedTokens; risk?: Risks }) {
		const regExp = new RegExp(`${position.token}.*${position.risk ?? ''}`);
		await this.page.locator(`[class*="_nextVaultCard_"]`).filter({ hasText: regExp }).click();
	}

	@step
	async previewSwitch() {
		await this.page.getByRole('button', { name: 'Preview Switch' }).click();
	}

	@step
	async shouldHavePreviewInfo({
		// metamask,
		// app,
		nominatedToken,
		targetToken,
	}: // risk,
	{
		// metamask: MetaMask;
		// app: App;
		nominatedToken: LazyNominatedTokens;
		targetToken: LazyNominatedTokens;
		// risk?: Risks;
	}) {
		const fromLocator = this.page.getByText('From', { exact: true }).locator('..');
		const toLocator = this.page.getByText('To', { exact: true }).locator('..');

		const liveApyRegexp = new RegExp('Live.*APY:.*[0-9]{1,2}.[0-9]{2}%');

		// Wait for Preview info to be fully loaded
		await expect(fromLocator).toContainText('Risk');

		await expect(fromLocator, `'From' box should have "${nominatedToken}"`).toContainText(
			nominatedToken
		);
		await expect(fromLocator, `'From' box should have "Live APY: xx.xx%"`).toContainText(
			liveApyRegexp
		);

		await expect(toLocator, `'To' box should have "${targetToken}"`).toContainText(targetToken);
		await expect(toLocator, `'To' box should have "Live APY: xx.xx%"`).toContainText(liveApyRegexp);

		const priceImpactRegExp = new RegExp(
			`([0-9],[0-9])?[0-9]{1,2}.[0-9]{2}([0-9]{2})?.*${targetToken}\\/${nominatedToken}.*\\([0-9].[0-9]{2}%\\)|n\\/a`
		);
		await expect(
			this.page.getByText('Price impact', { exact: true }).locator('..'),
			'Should have price impact: "(x.xx%)" or "n/a"'
		).toContainText(priceImpactRegExp);
	}

	@step
	async confirmSwitch() {
		await this.page.getByRole('button', { name: 'Switch' }).click();
	}
}
