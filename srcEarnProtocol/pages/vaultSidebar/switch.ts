import { expect } from '#earnProtocolFixtures';
import { step } from '#noWalletFixtures';
import { Page } from '@playwright/test';
import {
	EarnTokens,
	LazyNominatedTokens,
	RiskLevels,
	RiskManagementTypes,
} from 'srcEarnProtocol/utils/types';

export class Switch {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	@step
	async yourPositionShouldBe({
		network,
		token,
		riskLevel,
		riskManagementType,
		balance,
		liveAPY,
	}: {
		network?: 'arbitrum' | 'base' | 'ethereum';
		token?: EarnTokens;
		riskLevel?: RiskLevels;
		riskManagementType?: RiskManagementTypes;
		balance?: string;
		liveAPY?: string;
	}) {
		const positionLocator = this.page.locator('[class*="_cardWrapper_"]:has-text("Balance")');

		if (network) {
			await expect(positionLocator.getByTestId('vault-network').locator('svg')).toHaveAttribute(
				'title',
				`earn_network_${network}`,
			);
		}

		if (token) {
			await expect(positionLocator.getByTestId('vault-token')).toHaveText(token);
		}

		if (riskLevel) {
			await expect(positionLocator.locator('[class*="_titleRow_"]')).toContainText(riskLevel);
		}

		if (riskManagementType) {
			const riskTypeRegExp = new RegExp(
				riskManagementType === 'DAO Risk-Managed' ? 'DAO.*Risk-Managed' : 'Risk-Managed.*by.*B.*A',
			);
			await expect(
				positionLocator.getByText(riskTypeRegExp),
				`'${riskManagementType}' should be displayed`,
			).toBeVisible();
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
			token: EarnTokens;
			riskLevel?: RiskLevels;
			riskManagementType?: RiskManagementTypes;
			thirtyDayAPY?: string;
			liveAPY?: string;
			apySpread?: string;
		}[],
	) {
		for (const targetPosition of targetPositions) {
			const regExp = new RegExp(
				`${targetPosition.token}.*${targetPosition.riskLevel ?? ''}.*${!targetPosition.riskManagementType ? '' : targetPosition.riskManagementType === 'DAO Risk-Managed' ? 'DAO.*Risk-Managed' : 'Risk-Managed.*by.*B.*A'}`,
			);
			const positionLocator = this.page
				.locator('[class*="_cardWrapper_"]:has-text("Live APY")')
				.filter({ hasText: regExp });

			if (targetPosition.network) {
				await expect(positionLocator.getByTestId('vault-network').locator('svg')).toHaveAttribute(
					'title',
					`earn_network_${targetPosition.network}`,
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
	async selectTargetPosition(position: {
		token: LazyNominatedTokens;
		riskLevel?: RiskLevels;
		riskManagementType?: RiskManagementTypes;
	}) {
		const regExp = new RegExp(
			`${position.token}.*${position.riskLevel ?? ''}.*${position?.riskManagementType ? (position.riskManagementType === 'Risk-Managed by BlockAnalitica' ? 'Risk-Managed.*by.*B.*A' : 'DAO.*Risk-Managed') : ''}`,
		);
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
			nominatedToken,
		);
		await expect(fromLocator, `'From' box should have "Live APY: xx.xx%"`).toContainText(
			liveApyRegexp,
		);

		await expect(toLocator, `'To' box should have "${targetToken}"`).toContainText(targetToken);
		await expect(toLocator, `'To' box should have "Live APY: xx.xx%"`).toContainText(liveApyRegexp);

		const totalSwitchingRegExp = new RegExp(
			`([0-9],[0-9])?[0-9]{1,2}.[0-9]{2}([0-9]{2})?.*${nominatedToken}`,
		);
		await expect(
			this.page.locator('[class*="totalSwitchingBox_"]'),
			`Should have Total Switching: "x.xx ${nominatedToken}"`,
		).toContainText(totalSwitchingRegExp);

		const depositAssetRegExp = new RegExp(`${nominatedToken}.*${targetToken}`);
		await expect(
			this.page.getByText('Deposit asset', { exact: true }).locator('..'),
			`Should have Deposit asset: "${nominatedToken} --> ${targetToken}"`,
		).toContainText(depositAssetRegExp);

		const changingLiveApyRegExp = new RegExp(
			'[0-9]{1,2}.[0-9]{2}.*[0-9]{1,2}.[0-9]{2}.*\\(New Asset\\)',
		);
		await expect(
			this.page
				.locator('[class*="_whatsChangingBox_"]')
				.filter({ has: this.page.getByText('Live APY', { exact: true }) }),
			'Should have Live APY: "x.xx% --> x.xx% (New Asset)"',
		).toContainText(changingLiveApyRegExp);

		const changing30DayApyRegExp = new RegExp(
			'[0-9]{1,2}.[0-9]{2}.*[0-9]{1,2}.[0-9]{2}.*\\(New Asset\\)',
		);
		await expect(
			this.page
				.locator('[class*="_whatsChangingBox_"]')
				.filter({ has: this.page.getByText('30d APY', { exact: true }) }),
			'Should have 30d APY: "x.xx% --> x.xx% (New Asset)"',
		).toContainText(changing30DayApyRegExp);

		const earningDifferenceRegExp = new RegExp('\\$[0-9]{1,2}.[0-9]{2}.*\\$[0-9]{1,2}.[0-9]{2}');
		await expect(
			this.page
				.locator('[class*="_whatsChangingBox_"]')
				.filter({ has: this.page.getByText('1yr earning difference', { exact: true }) }),
			'Should have 1yr earning difference: "x.xx --> x.xx"',
		).toContainText(earningDifferenceRegExp);

		const priceImpactRegExp = new RegExp(
			`([0-9],[0-9])?[0-9]{1,2}.[0-9]{2}([0-9]{2})?.*${targetToken}\\/${nominatedToken}.*\\([0-9].[0-9]{2}%\\)|n\\/a`,
		);
		await expect(
			this.page.getByText('Price impact', { exact: true }).locator('..'),
			'Should have price impact: "(x.xx%)" or "n/a"',
		).toContainText(priceImpactRegExp);

		const swapRegExp = new RegExp('[0-9].[0-9]{4}.*[0-9].[0-9]{4}');
		await expect(
			this.page
				.locator('[class*="_whatsChangingBox_"]')
				.filter({ has: this.page.getByText('Swap', { exact: true }) }),
			'Should have Swap: "x.xx --> x.xx"',
		).toContainText(swapRegExp);

		await expect(
			this.page
				.locator('[class*="_whatsChangingBox_"]')
				.filter({ has: this.page.getByText('Slippage', { exact: true }) }),
			'Should have Slippage: "0.10%"',
		).toContainText('0.10%');

		const transactionFeeRegExp = new RegExp('\\$(<)?[0-9]{1,2}.[0-9]{2}|n\\/a');
		await expect(
			this.page
				.locator('[class*="_whatsChangingBox_"]')
				.filter({ has: this.page.getByText('Transaction fee', { exact: true }) }),
			'Should have Transaction fee: "$x.xx" or "$<0.01" or "n/a"',
		).toContainText(transactionFeeRegExp);
	}

	@step
	async confirmSwitch() {
		await this.page.getByRole('button', { name: 'Switch' }).click();
	}
}
