import { expect, step, test } from '#earnProtocolFixtures';
import { Locator, Page } from '@playwright/test';
import { expectDefaultTimeout } from 'utils/config';
import { BeachClub } from './beachClub';
import { Bridge } from './bridge';
import { Overview } from './overview';
import { RebalanceActivity } from './rebalanceActivity';
import { Rewards } from './rewards';
import { Send } from './send';
import { YouMightLike } from './youMightLike';
import { YourActivity } from './yourActivity';
import { Wallet } from './wallet';
import { LazyNominatedTokens, Networks, Risks } from 'srcEarnProtocol/utils/types';

type Tabs =
	| 'Overview'
	| 'Wallet'
	| 'Your Activity'
	| 'Rebalance Activity'
	| 'SUMR Rewards'
	| 'Beach Club';

type PositiondCardDataLabels =
	| '$SUMR'
	| '30d APY'
	| 'Live APY'
	| 'Market Value'
	| 'Net Contributions'
	| 'Earnings to Date'
	| '$SUMR Earned';

export class Portfolio {
	readonly page: Page;

	readonly portfolioSecondHeaderLocator: Locator;

	readonly beachClub: BeachClub;

	readonly bridge: Bridge;

	readonly overview: Overview;

	readonly rebalanceActivity: RebalanceActivity;

	readonly rewards: Rewards;

	readonly sendModal: Send;

	readonly youMightLike: YouMightLike;

	readonly yourActivity: YourActivity;

	readonly wallet: Wallet;

	constructor(page: Page) {
		this.page = page;
		this.portfolioSecondHeaderLocator = this.page.locator(
			'[class*="PortfolioHeader_secondRowWrapper_"]'
		);
		this.beachClub = new BeachClub(page);
		this.bridge = new Bridge(page);
		this.overview = new Overview(page);
		this.rebalanceActivity = new RebalanceActivity(page);
		this.rewards = new Rewards(page);
		this.sendModal = new Send(page);
		this.youMightLike = new YouMightLike(page);
		this.yourActivity = new YourActivity(page);
		this.wallet = new Wallet(page);
	}

	@step
	async shoulBeVisible(args?: { timeout: number }) {
		await expect(
			this.page.getByRole('heading', { name: 'Portfolio' }),
			'"Portfolio" header shouldbe visible'
		).toBeVisible({ timeout: args?.timeout ?? expectDefaultTimeout });
	}

	@step
	async openBridgePage() {
		await this.page.getByRole('button', { name: 'Bridge', exact: true }).click();
	}

	@step
	async open(wallet: string) {
		await expect(async () => {
			await this.page.goto(`/earn/portfolio/${wallet}`);
			await this.shoulBeVisible({ timeout: expectDefaultTimeout * 3 });
		}).toPass();
	}

	@step
	async shouldShowWalletAddress(shortenedWalletAddress: string, args?: { timeout: number }) {
		await expect(this.portfolioSecondHeaderLocator).toContainText(shortenedWalletAddress, {
			ignoreCase: true,
			timeout: args?.timeout ?? expectDefaultTimeout,
		});
	}

	@step
	async shouldShowOverviewAmounts({
		total$SUMR,
		totalWallet,
		timeout,
	}: {
		total$SUMR: string;
		totalWallet: string;
		timeout?: number;
	}) {
		if (total$SUMR) {
			const regExp = new RegExp(total$SUMR);
			await expect(
				this.portfolioSecondHeaderLocator
					.locator('[class*="_dataBlockWrapper_"]')
					.filter({ has: this.page.getByText('Total $SUMR', { exact: true }) })
					.locator('span')
			).toContainText(regExp, { timeout: timeout ?? expectDefaultTimeout });
		}

		if (totalWallet) {
			const regExp = new RegExp(`\\$${totalWallet}`);
			await expect(
				this.portfolioSecondHeaderLocator
					.locator('[class*="_dataBlockWrapper_"]')
					.filter({ has: this.page.getByText('Total Wallet Value', { exact: true }) })
					.locator('span')
			).toContainText(regExp, { timeout: timeout ?? expectDefaultTimeout });
		}
	}

	@step
	async shouldShowPositionData({
		network,
		token,
		risk,
		sumrApr,
		thirtyDayApy,
		liveApy,
		marketValue,
		netContributions,
		earningsToDate,
		sumrEarned,
		timeout,
	}: {
		network: Networks;
		token: LazyNominatedTokens;
		risk: Risks;
		sumrApr?: string;
		thirtyDayApy?: string;
		liveApy?: string;
		marketValue?: string;
		netContributions?: string;
		earningsToDate?: string;
		sumrEarned?: string;
		timeout?: number;
	}) {
		const positionLocator = this.page
			.locator('[class*="_positionWrapperCard_"]')
			.filter({
				has: this.page.locator(`[data-testid="vault-token"]:has-text("${token}")`),
			})
			.filter({ has: this.page.locator(`[title="earn_network_${network}"]`) })
			.filter({ hasText: risk });

		// Assertion with debugging purposes
		await expect(positionLocator, `Testing: ${network} ${token} ${risk} position`).toBeVisible();

		//
		const parameterLocator = (
			label:
				| '$SUMR'
				| '30d APY'
				| 'Live APY'
				| 'Market Value'
				| 'Net Contributions'
				| 'Earnings to Date'
				| '$SUMR Earned'
		) =>
			positionLocator
				.locator(
					`[class*="${
						['$SUMR', '30d APY', 'Live APY'].includes(label)
							? '_strategyInfoTopWrapper_'
							: '_historicalLegendItemWrapper'
					}"]`
				)
				.filter({ has: this.page.getByText(label) })
				.locator(
					['$SUMR', '30d APY', 'Live APY'].includes(label)
						? 'span[class*="_value_"]'
						: '[data-testid="historical-legend-item-value"]'
				);

		const shouldBeGreaterThanZero = async ({
			label,
			token,
		}: {
			label: PositiondCardDataLabels;
			token?: LazyNominatedTokens;
		}) => {
			const netValueText = await parameterLocator(label).innerText();

			const regExp = new RegExp(`${token}|SUMR`);
			const netValueNumber = parseFloat(
				netValueText
					.replace(regExp ?? '%', '')
					.replace('K', '')
					.replace('M', '')
			);

			expect(netValueNumber, `${label} net value should be greater than 0`).toBeGreaterThan(0);
		};

		const verifyPositionCardParameter = async ({
			label,
			expectedValue,
			token,
		}: {
			label:
				| '$SUMR'
				| '30d APY'
				| 'Live APY'
				| 'Market Value'
				| 'Net Contributions'
				| 'Earnings to Date'
				| '$SUMR Earned';
			expectedValue: string;
			token?: LazyNominatedTokens;
		}) => {
			await test.step(`Verify ${label}`, async () => {
				const regExp = new RegExp(
					`${expectedValue}${
						['$SUMR', '30d APY', 'Live APY'].includes(label)
							? '%'
							: label === '$SUMR Earned'
							? '.* SUMR'
							: `.* ${token}`
					}`
				);

				await expect(parameterLocator(label), `Should have ${label}: ${regExp}`).toContainText(
					regExp,
					{ timeout: timeout ?? expectDefaultTimeout }
				);

				await shouldBeGreaterThanZero({ label, token });
			});
		};

		if (sumrApr) {
			await verifyPositionCardParameter({ label: '$SUMR', expectedValue: sumrApr });
		}

		if (thirtyDayApy) {
			await verifyPositionCardParameter({ label: '30d APY', expectedValue: thirtyDayApy });
		}

		if (liveApy) {
			await verifyPositionCardParameter({ label: 'Live APY', expectedValue: liveApy });
		}

		if (marketValue) {
			await verifyPositionCardParameter({
				label: 'Market Value',
				expectedValue: marketValue,
				token,
			});
		}

		if (netContributions) {
			await verifyPositionCardParameter({
				label: 'Net Contributions',
				expectedValue: netContributions,
				token,
			});
		}

		if (earningsToDate) {
			await verifyPositionCardParameter({
				label: 'Earnings to Date',
				expectedValue: earningsToDate,
				token,
			});
		}

		if (sumrEarned) {
			await verifyPositionCardParameter({
				label: '$SUMR Earned',
				expectedValue: sumrEarned,
				token,
			});
		}
	}

	@step
	async selectTab(tab: Tabs) {
		await this.page.locator('[class*="_tabHeaders_"]').getByRole('button', { name: tab }).click();
	}

	@step
	async shouldHaveTabHighlighted(tab: Tabs) {
		await expect(
			this.page.locator('[class*="_tabHeaders_"]').getByRole('button', { name: tab })
		).toHaveClass(/active/);
	}

	@step
	async send() {
		await this.page.getByRole('button', { name: 'Send', exact: true }).click();
	}
}
