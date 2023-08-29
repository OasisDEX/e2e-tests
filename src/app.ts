import { Page } from '@playwright/test';
import {
	Borrow,
	Earn,
	Homepage,
	Multiply,
	PoolCreator,
	PoolFinder,
	Portfolio,
	Position,
} from './pages';

export class App {
	readonly page: Page;

	readonly borrow: Borrow;

	readonly earn: Earn;

	readonly homepage: Homepage;

	readonly multiply: Multiply;

	readonly poolCreator: PoolCreator;

	readonly poolFinder: PoolFinder;

	readonly portfolio: Portfolio;

	readonly position: Position;

	constructor(page: Page) {
		this.page = page;
		this.borrow = new Borrow(page);
		this.earn = new Earn(page);
		this.homepage = new Homepage(page);
		this.multiply = new Multiply(page);
		this.poolCreator = new PoolCreator(page);
		this.poolFinder = new PoolFinder(page);
		this.portfolio = new Portfolio(page);
		this.position = new Position(page);
	}

	async pause() {
		await this.page.pause();
	}
}
