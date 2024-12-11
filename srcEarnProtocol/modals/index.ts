import { Page } from '@playwright/test';
import { LogIn } from './logIn';

export class Modals {
	readonly page: Page;

	readonly logIn: LogIn;

	constructor(page: Page) {
		this.page = page;
		this.logIn = new LogIn(page);
	}
}
