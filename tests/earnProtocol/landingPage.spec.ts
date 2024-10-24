import { expect, test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Landin page', async () => {
	test('It should show strategy card', async ({ app }) => {
		await app.landingPage.open();
		await app.landingPage.shouldShowStrategyCard();
	});

	(['Right', 'Left'] as const).forEach((direction) => {
		test(`It should show strategy card to the ${direction}`, async ({ app }) => {
			await app.landingPage.open();

			// Get strategy info for current active strategy in carousel
			const originalStrategyCard =
				await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getDetails();

			// Select strategy to the right
			await app.landingPage.strategiesCarousel.moveToNextStrategy(direction, {
				timeout: expectDefaultTimeout * 2,
			});

			// Get strategy info for current active strategy in carousel
			const newStrategyCard =
				await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getDetails();

			// Logging strategies data for debugging purposes
			console.log('originalStrategyCard: ', originalStrategyCard);
			console.log('newStrategyCard: ', newStrategyCard);

			expect(
				originalStrategyCard.token == newStrategyCard.token &&
					originalStrategyCard.network == newStrategyCard.network &&
					originalStrategyCard.risk == newStrategyCard.risk
			).not.toBeTruthy();
		});
	});
});
