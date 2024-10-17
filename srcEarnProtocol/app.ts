import { Page } from '@playwright/test';
// import { Modals } from './modals';
import {
	// 	Borrow,
	Earn,
	Header,
	// 	Homepage,
	// 	Multiply,
	// 	Portfolio,
	// 	Position,
	// 	Rays,
} from './pages';

export class App {
	readonly page: Page;

	// readonly borrow: Borrow;

	readonly earn: Earn;

	readonly header: Header;

	// readonly homepage: Homepage;

	// readonly modals: Modals;

	// readonly multiply: Multiply;

	// readonly portfolio: Portfolio;

	// readonly position: Position;

	// readonly rays: Rays;

	constructor(page: Page) {
		this.page = page;
		// this.borrow = new Borrow(page);
		this.earn = new Earn(page);
		this.header = new Header(page);
		// this.homepage = new Homepage(page);
		// this.modals = new Modals(page);
		// this.multiply = new Multiply(page);
		// this.portfolio = new Portfolio(page);
		// this.position = new Position(page);
		// this.rays = new Rays(page);
	}

	async pause() {
		await this.page.pause();
	}
}
