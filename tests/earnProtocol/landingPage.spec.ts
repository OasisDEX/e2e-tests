import { expect, test } from '#earnProtocolFixtures';

test.describe('Landin page', async () => {
	test('It should show strategy card', async ({ app }) => {
		await app.landingPage.open();
		await app.landingPage.shouldShowStrategyCard();
	});

	(['Right', 'Left'] as const).forEach((direction) => {
		test(`It should show strategy card to the ${direction}`, async ({ app }) => {
			let originalStrategyCard = { token: '', network: '', risk: '' };
			let newStrategyCard = { token: '', network: '', risk: '' };

			await app.landingPage.open();

			// Get strategy info for current active strategy in carousel
			originalStrategyCard.token =
				await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getToken();
			originalStrategyCard.network =
				await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getNetwork();
			originalStrategyCard.risk =
				await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getRisk();

			// Select strategy to the right
			await app.landingPage.strategiesCarousel.moveToNextStrategy(direction);

			// Get strategy info for current active strategy in carousel
			newStrategyCard.token =
				await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getToken();
			newStrategyCard.network =
				await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getNetwork();
			newStrategyCard.risk =
				await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getRisk();

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
