import { test } from '#institutionsNoWalletFixtures';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Overview - Feedback', async () => {
	test.beforeEach(async ({ app }) => {
		await signIn({ app, userRights: 'client', role: 'Viewer' });
		await app.clientDashboard.feedback.open();
		await app.clientDashboard.feedback.shouldBeVisible();
	});

	test('It should list Feedback entries', async ({ app }) => {
		await app.clientDashboard.feedback.shouldHaveFeedbackLogs([
			{
				type: 'bug',
				reporter: 'Juan User',
				subject: 'Not working',
			},
			{
				type: 'feature request',
				reporter: 'Juan User',
				subject: 'Daily fun fact',
			},
			{
				type: 'question',
				reporter: 'Marcin Testing',
				subject: 'It says that i need to connect',
			},
		]);
	});
});
