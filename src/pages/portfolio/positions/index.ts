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

	byIdAndProtocol({ id, protocol }: { id: string; protocol: 'Aave V3' | 'Spark' }) {
		return new Position(
			this.listLocator
				.filter({ has: this.page.getByText(`Position #${id}`, { exact: true }) })
				.filter({ has: this.page.getByText(protocol, { exact: true }) })
		);
	}

	byUsdsStakingType(type: 'Sky Rewards Rate' | 'Chronicle Points') {
		return new Position(
			this.listLocator.filter({ has: this.page.getByText(type, { exact: true }) })
		);
	}
}
