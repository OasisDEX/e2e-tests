import { test } from '#institutionsFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Overview page - Client', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client' });
	});
	test('xxx', async ({ app }) => {
		// TODO
	});
});
