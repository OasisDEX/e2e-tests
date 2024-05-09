import { Locator, Page } from '@playwright/test';
import { Position } from './position';

export class Positions {
	readonly page: Page;

	readonly listLocator: Locator;

	readonly position: Position;

	readonly positionsLocator: Locator;

	constructor(page: Page, positionsLocator: Locator) {
		this.page = page;
		this.positionsLocator = positionsLocator;
		this.listLocator = positionsLocator.getByRole('link');
	}

	get first() {
		return this.nthPosition(0);
	}

	nthPosition(nth: number) {
		return new Position(this.listLocator.nth(nth));
	}

	byId(id: string) {
		return new Position(
			this.listLocator.filter({ has: this.page.getByText(`Position #${id}`, { exact: true }) })
		);
	}
}
