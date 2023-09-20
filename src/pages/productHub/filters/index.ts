import { Locator } from '@playwright/test';
import { Networks } from './networks';
import { Protocols } from './protocols';

export class Filters {
	readonly networks: Networks;

	readonly protocols: Protocols;

	constructor(productHubLocator: Locator) {
		this.networks = new Networks(productHubLocator);
		this.protocols = new Protocols(productHubLocator);
	}
}
