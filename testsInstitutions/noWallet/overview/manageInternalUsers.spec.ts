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

	// TO DO
	test.skip('It should edit a user', async ({ app }) => {
		// TO DO
	});
});
