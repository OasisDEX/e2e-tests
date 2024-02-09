import { expect } from '@playwright/test';
import { App } from 'src/app';

export const updateFlagsAndRejectCookies = async ({
	app,
	featuresFlags,
	automationMinNetValueFlags,
}: {
	app: App;
	featuresFlags?: string[];
	automationMinNetValueFlags?: string[];
}) => {
	// 'ob-config-overrides' takes some time to be loaded to Local Storage
	let localStorage: any;
	await expect(async () => {
		await app.page.evaluate(() =>
			window.localStorage.setItem(
				'cookieSettings',
				'{"accepted":false,"enabledCookies":{"marketing":false,"analytics":false},"version":"ver-26.06.2023"}'
			)
		);

		localStorage = await app.page.evaluate(() => window.localStorage);
		expect(localStorage).toMatchObject({
			'ob-config-overrides': expect.any(String),
		});

		const obConfigOverrides = JSON.parse(localStorage['ob-config-overrides']);

		if (featuresFlags) {
			featuresFlags.forEach((flag) => {
				const flagValues: string[] = flag.split(':');
				obConfigOverrides.features[flagValues[0]] = flagValues[1] === 'true';
			});
		}

		if (automationMinNetValueFlags) {
			automationMinNetValueFlags.forEach((flag) => {
				const flagValues: string[] = flag.split(':');
				obConfigOverrides.parameters.automation.minNetValueUSD[flagValues[0]][flagValues[1]] =
					flagValues[2];
			});
		}

		if (featuresFlags || automationMinNetValueFlags) {
			await app.page.evaluate(
				(obConfigOverrides) =>
					localStorage.setItem('ob-config-overrides', JSON.stringify(obConfigOverrides)),
				obConfigOverrides
			);
		}
	}).toPass();

	await app.page.reload();
};
