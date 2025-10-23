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
				name: 'Juan Test User 2',
				email: 'summerfi.test.4@gmail.com',
				role: 'RoleAdmin',
				createdAt: '2025-10-22',
			},
		]);
	});
});
