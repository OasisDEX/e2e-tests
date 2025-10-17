import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Overview page - Client', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client' });
	});
	test('I should display User role', async ({ app }) => {
		await app.clientOverview.shouldHaveRoles({ user: 'Viewer', wallet: 'No wallet connected' });
	});
});
