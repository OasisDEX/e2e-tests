import { test } from '#institutionsWithWalletFixtures';
import { connectWallet } from 'srcInstitutions/utils/connectWallet';
import { signIn } from 'srcInstitutions/utils/signIn';

test.describe('Header - Client -  With wallet', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);

		await signIn({ app, userRights: 'client', role: 'Viewer' });
	});

	test('It should connect wallet', async ({ app, metamask }) => {
		await app.header.shouldHave({ connectWallet: true });

		await connectWallet({ app, metamask });
	});
});

test.describe('Header - Admin -  With wallet', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);

		await signIn({ app, userRights: 'admin' });
	});

	test('It should connect wallet', async ({ app, metamask }) => {
		await app.header.shouldHave({ connectWallet: true });

		await connectWallet({ app, metamask });
	});
});
