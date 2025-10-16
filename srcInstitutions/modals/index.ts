import { Page } from '@playwright/test';
import { SignIn } from './signIn';

export class Modals {
	readonly page: Page;

	readonly signIn: SignIn;

	constructor(page: Page) {
		this.page = page;
		this.signIn = new SignIn(page);
	}
}
