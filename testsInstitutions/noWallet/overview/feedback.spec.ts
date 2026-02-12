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
				type: 'Bug',
				reporter: 'Juan User',
				subject: 'Not working',
			},
			{
				type: 'Feature Request',
				reporter: 'Juan User',
				subject: 'Daily fun fact',
			},
			{
				type: 'Question',
				reporter: 'Marcin Testing',
				subject: 'It says that i need to connect',
			},
		]);
	});

	test('It should allow to provide feedbak', async ({ app }) => {
		// Report a Bug
		await app.clientDashboard.feedback.selectFeedbackType('Bug');
		await app.clientDashboard.feedback.typeFeedback('This is a bug report');
		await app.clientDashboard.feedback.shouldHaveSubmitButtonEnabled();

		// Report a Feature Request
		await app.clientDashboard.feedback.selectFeedbackType('Feature Request');
		await app.clientDashboard.feedback.typeFeedback('This is a Feature Request report');
		await app.clientDashboard.feedback.shouldHaveSubmitButtonEnabled();

		// Report a Question
		await app.clientDashboard.feedback.selectFeedbackType('Question');
		await app.clientDashboard.feedback.typeFeedback('This is a question report');
		await app.clientDashboard.feedback.shouldHaveSubmitButtonEnabled();
	});
});
