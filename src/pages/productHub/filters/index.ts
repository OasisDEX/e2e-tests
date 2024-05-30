import { Locator, Page } from '@playwright/test';
import { step } from '#noWalletFixtures';
import { Base } from 'src/pages/position/base';
import { CollateralTokens } from './collateralTokens';
import { DebtTokens } from './debtTokens';
import { Networks } from './networks';
import { Protocols } from './protocols';

export class Filters {
	readonly page: Page;

	readonly base: Base;

	readonly collateralTokens: CollateralTokens;

	readonly debtTokens: DebtTokens;

	readonly networks: Networks;

	readonly productHubLocator: Locator;

	readonly protocols: Protocols;

	constructor(page: Page, productHubLocator: Locator) {
		this.page = page;
		this.productHubLocator = productHubLocator;
		this.base = new Base(page);
		this.collateralTokens = new CollateralTokens(productHubLocator);
		this.debtTokens = new DebtTokens(productHubLocator);
		this.networks = new Networks(productHubLocator);
		this.protocols = new Protocols(productHubLocator);
	}

	/**
	 * @param value should be between '0' and '1' both included | 0: far left | 1: far right
	 */
	@step
	async setMinLiquidity({ value }: { value: number }) {
		await this.productHubLocator.getByRole('button', { name: 'Min. Liquidity' }).click();
		await this.base.moveSliderOmni({ value });
		// Click again to hide slider
		await this.productHubLocator.getByRole('button', { name: 'Min. Liquidity' }).click();
		// Wait for pools to be loaded
		await this.page.waitForTimeout(1000);
	}
}
