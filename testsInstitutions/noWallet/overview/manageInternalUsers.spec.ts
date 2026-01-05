import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Client dashboard - Overview - Manage internal users - Viewer role', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
		await app.clientDashboard.overview.selectPanel('Manage internal users');
	});

	test('It should not have access to "Manage internal users" panel', async ({ app }) => {
		await app.clientDashboard.overview.manageInternalUsers.shouldNotHavePermission();
	});
});

test.describe('Client dashboard - Overview - Manage internal users - Admin role', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'RoleAdmin' });
		await app.clientDashboard.overview.selectPanel('Manage internal users');
	});

	test(`It should display users' list`, async ({ app }) => {
		await app.clientDashboard.overview.manageInternalUsers.shouldHaveUsers([
			{
				name: 'Juan Test User',
				email: 'summerfi.test.2@gmail.com',
				role: 'Viewer',
				createdAt: '2025-10-17',
			},
			{
				name: 'Chris',
				email: 'chris+demo@summer.fi',
				role: 'RoleAdmin',
				createdAt: '2025-12-18',
			},
			{
				name: 'Marcin Testing',
				email: 'testing@plamka.net',
				role: 'SuperAdmin',
				createdAt: '2025-08-08',
			},
		]);
	});

	test('It should edit a user', async ({ app }) => {
		await app.clientDashboard.overview.manageInternalUsers.editUser('Juan Test User');

		await app.clientDashboard.overview.manageInternalUsers.edit.shouldBeVisible();

		const randomNumberString = Math.floor(Math.random() * 9999).toString();
		await app.clientDashboard.overview.manageInternalUsers.edit.enterNewUsername(
			`Juan Test User ${randomNumberString}`
		);

		await app.page.waitForTimeout(1_000);
		await app.clientDashboard.overview.manageInternalUsers.edit.update();

		await app.page.waitForTimeout(1_000);
		await app.clientDashboard.overview.manageInternalUsers.edit.goBack();

		await app.clientDashboard.overview.manageInternalUsers.shouldBeVisible();
		await app.clientDashboard.overview.manageInternalUsers.shouldHaveUsers([
			{
				name: randomNumberString,
				email: 'summerfi.test.2@gmail.com',
				role: 'Viewer',
				createdAt: '2025-10-17',
			},
		]);
	});
});
