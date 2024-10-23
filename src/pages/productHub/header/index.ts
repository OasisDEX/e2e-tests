import { Locator } from '@playwright/test';
import { PositionType } from './positionType';

export class Header {
	readonly headerLocator: Locator;

	readonly positionType: PositionType;

	constructor(productHubLocator: Locator) {
		this.headerLocator = productHubLocator.locator('#product-hub');
		this.positionType = new PositionType(this.headerLocator);
	}
}
