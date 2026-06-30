import { test } from '#institutionsNoWalletFixtures';
import { openInstitutionDashboard } from 'srcInstitutions/utils/openInstitutionDashboard';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Client dashboard - Overview - Manage internal users - Viewer role', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'admin' });
		await openInstitutionDashboard({ app, institution: 'Ext Demo Corp' });

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
				name: 'An**ei',
				email: 'an*********@su****.fi',
				role: 'Viewer',
				createdAt: '2026-01-30',
			},
			{
				name: 'Ch*is',
				email: 'ch********@su****.fi',
				role: 'RoleAdmin',
				createdAt: '2025-12-18',
			},
		]);
	});
});
