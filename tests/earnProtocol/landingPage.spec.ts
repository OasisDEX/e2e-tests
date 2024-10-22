import { expect, test } from '#earnProtocolFixtures';

test.describe('Landin page', async () => {
	test('It should show strategy card', async ({ app }) => {
		await app.landingPage.open();
		await app.landingPage.shouldShowStrategyCard();
	});

	test('It should show strategy card to the right', async ({ app }) => {
		let originalStrategyCard: { token: string; network: string; risk: string };
		let newStrategyCard: { token: string; network: string; risk: string };

		await app.landingPage.open();

		// Get strategy info for current active strategy in carousel
		originalStrategyCard.token =
			await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getToken();
		originalStrategyCard.network =
			await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getNetwork();
		originalStrategyCard.risk =
			await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getRisk();

		// Select strategy to the right
		await app.landingPage.strategiesCarousel.moveToNextStrategy('Right');

		// Get strategy info for current active strategy in carousel
		newStrategyCard.token =
			await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getToken();
		newStrategyCard.network =
			await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getNetwork();
		newStrategyCard.risk =
			await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getRisk();

		expect(
			originalStrategyCard.token == newStrategyCard.token &&
				originalStrategyCard.network == newStrategyCard.network &&
				originalStrategyCard.risk == newStrategyCard.risk
		).not.toBeTruthy();
	});

	test('It should show strategy card to the left', async ({ app }) => {
		let originalStrategyCard: { token: string; network: string; risk: string };
		let newStrategyCard: { token: string; network: string; risk: string };

		await app.landingPage.open();

		// Get strategy info for current active strategy in carousel
		originalStrategyCard.token =
			await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getToken();
		originalStrategyCard.network =
			await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getNetwork();
		originalStrategyCard.risk =
			await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getRisk();

		// Select strategy to the left
		await app.landingPage.strategiesCarousel.moveToNextStrategy('Left');

		// Get strategy info for current active strategy in carousel
		newStrategyCard.token =
			await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getToken();
		newStrategyCard.network =
			await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getNetwork();
		newStrategyCard.risk =
			await app.landingPage.strategiesCarousel.activeSlide.strategyCard.header.getRisk();

		expect(
			originalStrategyCard.token == newStrategyCard.token &&
				originalStrategyCard.network == newStrategyCard.network &&
				originalStrategyCard.risk == newStrategyCard.risk
		).not.toBeTruthy();
	});
});
