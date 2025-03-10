import { expect, test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';

const numberOfPositions = Array.from({ length: 118 }, (_, index) => 0 + index);

test.describe('Open position pages', async () => {
	numberOfPositions.forEach((positionIndex) =>
		test(`It should open position page from Portfolio page - Position index ${positionIndex}`, async ({
			app,
		}) => {
			test.setTimeout(longTestTimeout);

			await app.portfolio.open('0xbEf4befb4F230F43905313077e3824d7386E09F8', {
				withPositions: true,
			});

			await app.portfolio.positionsHub.showEmptyPositions();
			const positionPageLink =
				(await app.portfolio.positionsHub.getNthPositionLink(positionIndex)) ?? '';
			// Console log for debugging purposes in case of test fail
			console.log('Position page: ', positionPageLink);

			await app.portfolio.positionsHub.openNthPosition(positionIndex);
			await expect(async () => {
				const lostConnection = app.page.getByText('Lost connection');
				if (await lostConnection.isVisible()) {
					// await app.position.openPage(positionPageLink, { tab: 'Overview' });
					await app.page.reload();
				}
				await app.position.overview.shouldBeVisible({ tab: 'Overview' });
			}).toPass();
		})
	);
});
