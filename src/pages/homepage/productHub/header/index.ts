import { Locator } from '@playwright/test';
import { PositionType } from './position';

export class Header {
	readonly headerLocator: Locator;

	readonly positionType: PositionType;

	constructor(headerLocator: Locator) {
		this.headerLocator = headerLocator;
		this.positionType = new PositionType(this.headerLocator);
	}
}
