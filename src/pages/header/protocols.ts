import { Locator, Page } from '@playwright/test';

type Protocol = 'Aave' | 'Maker' | 'Spark';
type Product = 'Borrow' | 'Multiply' | 'Earn' | 'Amplify' | 'Access';

export class Protocols {
	readonly page: Page;

	readonly headerLocator: Locator;

	constructor(page: Page, headerLocator: Locator) {
		this.page = page;
		this.headerLocator = headerLocator;
	}

	async open() {
		await this.headerLocator.getByText('Protocols', { exact: true }).hover();
	}

	async hoverOver(protocol: Protocol) {
		const protocolDescription = {
			Aave: 'Borrow, Multiply and Earn on multiple tokens with the top liquidity protocol.',
			Maker: 'Borrow, Multiply and Earn with',
			Spark: 'Borrow, Multiply and Earn on Spark.',
		};
		await this.headerLocator.getByText(protocolDescription[protocol]).hover();
	}

	async select({ protocol, product }: { protocol: Protocol; product: Product }) {
		const menuOptionLocator = {
			AaveBorrow: this.headerLocator.getByText(
				'Borrow against ETH, WBTC, sDAI and other types of collateral.'
			),
			AaveMultiply: this.headerLocator.getByText(
				'Increase exposure to ETH, WBTC and more; access top risk management tools.'
			),
			AaveEarn: this.headerLocator.getByText(
				'Earn yield on ETH, sDAI and more; lend or yield loop strategies in one transaction.'
			),
			AaveAmplify: this.headerLocator
				.getByText('Use Summer.fi earn to increase your exposure to stETH yield seamlessly.')
				.nth(0),
			MakerBorrow: this.headerLocator.getByText('Borrow DAI against ETH, LSTs and WBTC.'),
			MakerMultiply: this.headerLocator.getByText(
				'Increase exposure to ETH, LSTs and WBTC; access top risk management tools.'
			),
			MakerEarn: this.headerLocator.getByText('Earn with the Dai Savings Rate and mint sDAI.'),
			MakerAccess: this.headerLocator.getByText(
				'Earn risk reduced yield on DAI with the Maker Protocols Dai Savings Rate.'
			),
		};

		const menuOptionDescription = {
			AaveBorrow: 'Borrow against ETH, WBTC, sDAI and other types of collateral.',
			AaveMultiply: 'Increase exposure to ETH, WBTC and more; access top risk management tools.',
			AaveEarn:
				'Earn yield on ETH, sDAI and more; lend or yield loop strategies in one transaction.',
			AaveAmplify: 'Use Summer.fi earn to increase your exposure to stETH yield seamlessly.',
			MakerBorrow: 'Borrow DAI against ETH, LSTs and WBTC.',
			MakerMultiply: 'Increase exposure to ETH, LSTs and WBTC; access top risk management tools.',
			MakerEarn: 'Earn with the Dai Savings Rate and mint sDAI.',
			MakerAccess: 'Earn risk reduced yield on DAI with the Maker Protocols Dai Savings Rate.',
			SparkBorrow:
				'Borrow DAI at the best rate, with the highest LTVs. Become eligible for token rewards.',
			SparkMultiply: 'Increase exposure to ETH and LSTs; access top risk management tools.',
			SparkEarn: 'Earn yield on ETH and DAI. Become eligible for token rewards.',
			SparkAmplify: 'Use Summer.fi earn to increase your exposure to stETH yield seamlessly.',
		};

		await this.open();
		await this.hoverOver(protocol);
		await this.headerLocator
			.getByText(menuOptionDescription[`${protocol}${product}`])
			.nth(`${protocol}${product}` === 'SparkAmplify' ? 1 : 0)
			.click();
	}
}
