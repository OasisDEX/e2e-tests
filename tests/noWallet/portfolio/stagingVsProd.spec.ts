import { expect, test } from '#noWalletFixtures';
import { longTestTimeout, portfolioTimeout } from 'utils/config';

test.describe('Staging vs Production - Wallet not connected', async () => {
	// ['0x10649c79428d718621821Cf6299e91920284743F', '0xae362a72935dac355be989bf490a7d929f88c295']

	/* 
		Overview values -- DONE
		Number of positions -- DONE
		Position types?
		Assets?
		Any other things?
	*/

	test('It should show same info in Portfolio - Staging vs Production @regression', async ({
		app,
	}) => {
		test.info().annotations.push({
			type: 'Test case',
			description: 'xxxx',
		});

		test.setTimeout(longTestTimeout);

		// STAGING - 1st log
		await app.portfolio.open('0xae362a72935dac355be989bf490a7d929f88c295');
		await app.portfolio.shouldHaveWalletAddress({
			address: '0xae36...8c295',
			timeout: portfolioTimeout,
		});
		const stagingData1 = await app.portfolio.getPortfolioData();

		console.log('+++ stagingData1: ', stagingData1);

		// PRODUCTION
		await app.portfolio.openOnProduction('0xae362a72935dac355be989bf490a7d929f88c295');
		await app.portfolio.shouldHaveWalletAddress({
			address: '0xae36...8c295',
			timeout: portfolioTimeout,
		});
		const productionData = await app.portfolio.getPortfolioData();

		// STAGING - 2nd log (Portfolio data is updated from time to time)
		await app.portfolio.open('0xae362a72935dac355be989bf490a7d929f88c295');
		await app.portfolio.shouldHaveWalletAddress({
			address: '0xae36...8c295',
			timeout: portfolioTimeout,
		});
		const stagingData2 = await app.portfolio.getPortfolioData();

		// Check that productionData is equal to either stagingData1 or stagingData2
		for (const property in productionData) {
			expect([stagingData1[property], stagingData2[property]]).toContain(productionData[property]);
		}
	});
});
