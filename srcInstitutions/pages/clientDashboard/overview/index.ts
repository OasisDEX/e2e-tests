import { expect, step } from '#institutionsNoWalletFixtures';
import { Page } from '@playwright/test';
import { InstitutionOverview } from './institutionOverview';
import { ManageInternalUsers } from './manageInternalUsers';

type Panels = 'Institution overview' | 'Manage internal users';

export class Overview {
	readonly page: Page;

	readonly institutionOverview: InstitutionOverview;

	readonly manageInternalUsers: ManageInternalUsers;

	constructor(page: Page) {
		this.page = page;
		this.institutionOverview = new InstitutionOverview(page);
		this.manageInternalUsers = new ManageInternalUsers(page);
	}

	@step
	async openPage() {
		await this.page.goto('/test-client/overview/institution');
	}

	@step
	async shouldBeVisible() {
		await expect(
			this.page.getByRole('button', { name: 'Institution overview' }),
			'Institutions overview panel should be visible',
		).toBeVisible();
	}

	@step
	async shouldHavePanelActive(panel: Panels) {
		await expect(this.page.getByRole('button', { name: panel }).locator('div').first()).toHaveClass(
			/_activeButtonText_/,
		);
	}

	@step
	async selectPanel(panel: Panels) {
		await this.page.getByRole('button', { name: panel }).click();
	}
}
