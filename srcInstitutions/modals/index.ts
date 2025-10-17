import { Page } from '@playwright/test';
import { Mfa } from './mfa';
import { SignIn } from './signIn';

export class Modals {
	readonly page: Page;

	readonly mfa: Mfa;

	readonly signIn: SignIn;

	constructor(page: Page) {
		this.page = page;
		this.mfa = new Mfa(page);
		this.signIn = new SignIn(page);
	}
}
