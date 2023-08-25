import { expect, Locator, Page } from '@playwright/test';
import { Position } from './position';

export class Header {
	readonly headerLocator: Locator;

	readonly position: Position;

	constructor(productHubLocator: Locator) {
		this.headerLocator = productHubLocator.locator('#product-hub');
		this.position = new Position(this.headerLocator);
	}
}
