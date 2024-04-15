import { expect, test } from '#noWalletFixtures';
import { longTestTimeout } from 'utils/config';
import { comparePositionsData, shortenAddress } from 'utils/general';
import { PortfolioData } from 'src/pages/portfolio';

test.describe('Staging vs Production - Wallet not connected', async () => {
	/* 
		Overview values -- DONE
		Number of positions -- DONE
		Position types and pools -- DONE
		Assets -- TO BE DONE
	*/

	[
		'0x458F04fEAB592Cd28f29A9926f86292A9Ef20600',
		'0x9C3c6cF9D29Ab9E9e14503dbfC9aD8bB2A0E37EF',
		'0x000009818d53763C701bA86586152c667Ac3AcdB',
		'0xae362a72935dac355be989bf490a7d929f88c295',
		'0x280dEd1b7e430BeD0Cbb0Aace452Fd2ADEf2b581',
		'0x83664B8a83b9845Ac7b177DF86d0F5BF3b7739AD',
		'0x39Cc77F88C7CFE2139066a7e987746e2Cd3bAd38',
	].forEach((walletAddress) =>
		test(`It should show same info in Portfolio - Staging vs Production - ${shortenAddress(
			walletAddress
		)} @regression`, async ({ app }) => {
			test.info().annotations.push({
				type: 'Test case',
				description: '14090',
			});

			test.setTimeout(longTestTimeout);

			let stagingData1: PortfolioData;
			let stagingData2: PortfolioData;
			let productionData1: PortfolioData;
			let productionData2: PortfolioData;

			// STAGING - 1st log
			await app.portfolio.loadPortfolioPageAndPositions({ environment: 'staging', walletAddress });
			await app.portfolio.positions.showEmptyPositions();
			await app.portfolio.shouldHaveViewingWalletBanner(shortenAddress(walletAddress));
			stagingData1 = await app.portfolio.getPortfolioData();

			// PRODUCTION - 1st log
			await app.portfolio.loadPortfolioPageAndPositions({
				environment: 'production',
				walletAddress,
			});
			await app.portfolio.positions.showEmptyPositions();
			await app.portfolio.shouldHaveViewingWalletBanner(shortenAddress(walletAddress));
			productionData1 = await app.portfolio.getPortfolioData();

			if (stagingData1.portfolioValue === productionData1.portfolioValue) {
				// Check that productionData1 is equal to stagingData1
				for (const property in productionData1) {
					if (property === 'positionsListedData') {
						expect(
							comparePositionsData(
								stagingData1.positionsListedData,
								productionData1.positionsListedData
							)
						).toBeTruthy();
					} else {
						expect(stagingData1[property]).toEqual(productionData1[property]);
					}
				}
			} else {
				// STAGING - 2nd log (Portfolio data is updated from time to time)
				await app.portfolio.loadPortfolioPageAndPositions({
					environment: 'staging',
					walletAddress,
				});
				await app.portfolio.positions.showEmptyPositions();
				await app.portfolio.shouldHaveViewingWalletBanner(shortenAddress(walletAddress));
				stagingData2 = await app.portfolio.getPortfolioData();

				if (stagingData2.portfolioValue === productionData1.portfolioValue) {
					// Check that productionData2 is equal to stagingData1
					for (const property in productionData1) {
						if (property === 'positionsListedData') {
							expect(
								comparePositionsData(
									stagingData2.positionsListedData,
									productionData1.positionsListedData
								)
							).toBeTruthy();
						} else {
							expect(stagingData2[property]).toEqual(productionData1[property]);
						}
					}
				} else {
					// PRODUCTION - 2nd log (Portfolio data is updated from time to time)
					await app.portfolio.loadPortfolioPageAndPositions({
						environment: 'production',
						walletAddress,
					});
					await app.portfolio.positions.showEmptyPositions();
					await app.portfolio.shouldHaveViewingWalletBanner(shortenAddress(walletAddress));
					productionData2 = await app.portfolio.getPortfolioData();

					// Check that productionData2 is equal to stagingData2
					for (const property in productionData2) {
						if (property === 'positionsListedData') {
							expect(
								comparePositionsData(
									stagingData2.positionsListedData,
									productionData2.positionsListedData
								)
							).toBeTruthy();
						} else {
							expect(stagingData2[property]).toEqual(productionData2[property]);
						}
					}
				}
			}
		})
	);
});
