import { test } from '#earnProtocolFixtures';

test('Header - Open Earn page', async ({ app }) => {
	await app.header.shouldHaveSummerfiLogo();

	await app.header.earn();

	// TO BE COMPOLETED

	//
	// await app.pause();
	//
});
