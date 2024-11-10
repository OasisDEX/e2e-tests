<div align="center">
  <img src="https://raw.githubusercontent.com/OasisDEX/oasis-borrow/dev/public/static/img/logos/logo_dark.svg" width="500" height="500" />

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
</div>

# Repository with E2E tests for Summer.fi DeFi web application

1. [ Introduction ](#1-introduction)
2. [ Installation ](#2-installation)
3. [ Environment variables](#3-environment-variables)
4. [ Browsers ](#4-browsers)
5. [ Running the tests ](#5-running-the-tests)
6. [ Test reports ](#6-test-reports)
7. [ Tags ](#7-tags)
8. [ Projects ](#8-projects)
9. [ License ](#9-license)

## 1. Introduction
This repository contains a repository of tests for the e2e testing of the Summer.fi DeFi web application.

There are two main categories of e2e tests:
- **No wallet**: 
Tests without a wallet connected. 
- **With wallet**: 
Tests with a wallet connected (Metamask) and, in most of the cases, with a Tenderly fork.

The tests and framework have been written using Playwright and Typescript. 
- The 'No wallet' tests use Playwright only.
- The 'With wallet' tests use Playwright, **Synpress** (for Metamask wallet) and **Tenderly APIs** (for forks).

## 2. Installation
First, install the programs required to run the application:

- [Node.js](https://nodejs.org/en/download/)


Next, clone this repository:
```
git clone https://github.com/OasisDEX/e2e-tests.git
```

Go to the repo directory and install the dependencies:
```
yarn install
```


## 3. Environment variables
To run the tests locally you will need to create a `.env` file. You can create a copy from `.env.example` file by running: 
```
cp .env.example .env
```

There aren't any mandatory environment variables for **no wallet** tests.

The following environment variables are **mandatory** for **with wallet** tests:

| Variable | Description |
| --- | --- |
| TENDERLY_PROJECT | Your project in Tenderly. Or create a new one. |
| TENDERLY_USER | Your user in Tenderly. Or create a new one. |
| TENDERLY_ACCESS_KEY | Your access key in Tenderly. Create one if you don't have any. |
| OLD_WALLET_PK | Password key of your Rays testing wallet. Note that such wallet should have Summer.fi positions. |
| ONE_INCH_API_KEY | Your 1inch API key. Create one if you don't have any. |

You can also use these other environment variables:

| Variable | Default | Description |
| --- | --- | -- |
| BASE_URL | This is the base url used to run the tests. As per `.env.example` file. If you don't set this variable the tests will run with `https://staging.summer.fi` as base url|
| FULLY_PARALLEL | false | Playwright Test runs tests in parallel. In order to achieve that, it runs several worker processes that run at the same time. By default, **test files** are run in parallel. However, tests in a single file are run in order, in the same worker process. You can configure entire test run to concurrently execute all tests in all files using this option. Note that **with wallet** tests can run **only** serial mode, so this variable will be applied only to **no wallet tests**. |
| WORKERS | 1 | Number of workers used to run the tests. To run the tests in pralallel you need to use more than 1 workers. Note that **with wallet** tests can run **only** with 1 worker, so this variable will be applied only to **no wallet tests**. |
| TIMEOUT | 30000 | Timeout for each test in milliseconds. Note that some timeouts have been defined in `./utils/config.ts` file, so this TIMEOUT variable might not have any effect in some cases. |
| RETRIES | 2 | The maximum number of retry attempts given to failed tests. By default failing tests are not retried. |
| HEADLESS | true | Whether to run browser in headless mode. Note that **with wallet** tests can run **only** in headed mode, so this variable will be applied only to **no wallet tests**. |
| FLAGS | '' | You can pass one or more flags to enable hidden features in staging and dev environments. To pass more than one flag separate them with an empty space: `'flag1:true flag2:false'` |

## 4. Browsers
For now the tests have been setup so that they run only on desktop Chrome.

## 5. Running the tests
**Note** that in oder to considerably reduce the test execution time, several scripts have been created so that **with wallet** tests can be run in parallel jobs (docker containers) in GitHub actions.

1. Create `.env` file.

2. For running **with wallet** tests, set `TENDERLY_PROJECT`, `TENDERLY_USER` and `TENDERLY_ACCESS_KEY` variables in `.env` file.

3. For running **with wallet - tokenSwapRate** tests, set `ONE_INCH_API_KEY`variable in `.env` file.

4. For running **with wallet - Rays** tests, set `OLD_WALLET_PK`variable in `.env` file, but note that such wallet will need to contain Summer.fi positions. Moreover, you'll need to update the position path in *tests > withWallet > rays > positionPages.spec.ts*: 
`await app.position.openPage('/arbitrum/aave/v3/multiply/eth-dai/1#overview')` 

5. Run tests by running, for example:
- Run all tests:
`yarn test:e2e`
- Run all **regression** tests:
`yarn test:e2e:regression`
- Run **no wallet** tests:
`yarn no-wallet`
- Run **no wallet regression** tests:
`yarn no-wallet:regression`
- Run **with wallet** tests:
`yarn with-wallet:all`
- Run **with wallet regression** tests:
`yarn with-wallet:all:regression`

Check all the scripts in [ package.json ](https://github.com/OasisDEX/e2e-tests/blob/main/package.json#L17) file

## 6. Test reports
> The test reports for the test runs executed in gitHub can be found in https://github.com/OasisDEX/e2e-tests/actions.
> 1. Click on the test run you wish to see the report for.
> 2. Scroll down to the **Artifacts** section and click on the report name you wish to download.
> 3. Unzip the report file you just downloaded and double click on the **index.html** file to open the report in the browser.  

After running one or more tests locally you can run the following commands to open test reports in the browser *(check all the scripts in [ package.json ](https://github.com/OasisDEX/e2e-tests/blob/main/package.json#L124) file)*:
- `yarn test:report:no-wallet`
- `yarn test:report:with-wallet:aave:ethereum`
- `yarn test:report:with-wallet:aave:other`
- `yarn test:report:with-wallet:maker-and-spark`  

## 7. Tags 
Tests can be tagged so that we can run only the tests that have the certain tag. 
At the moment we are using the following tags:
- `@regression`: Add this tag to all the tests that should be part of the regression test suite.

## 8. Projects
A project is a logical group of tests running with the same configuration. For now we are using projects so that we can achieve the two following goals:
- Applying different configuration to **no wallet** and **with wallet** tests.
- Splitting **with wallet** tests so that they can run in parallel containers, and so reducing significantly the test execution time.

Check all the projects that are used at the moment in [ playwright.config.ts ](https://github.com/OasisDEX/e2e-tests/blob/main/playwright.config.ts#L31) file.

## 9. Utils for manual testing
Some scripts have been added for easily creating a tenderly fork and adding funds for most of the tokens supported by Summer.fi. 
They can be foud in [ utilsManualTesting ](https://github.com/OasisDEX/e2e-tests/tree/main/utilsManualTesting) folder.

**Running command in console**
1. Create `.env` file.

2. Set `TENDERLY_PROJECT`, `TENDERLY_USER`, `TENDERLY_ACCESS_KEY`, `NETWORK` and `WALLET_ADDRESS` variables in `.env` file.

3. Run `yarn create-fork-github` in the console. 

4. Wait for the console to log the network, wallet address, funds added and fork RPC. 

**Using GitHub Actions**
1. Go to repository `Actions > Create fork and add funds to wallet`: https://github.com/OasisDEX/e2e-tests/actions/workflows/createForkWithFunds.yml
2. Click on `Run workflow` drop down button.
3. Enter the network you wish and your testing wallet address.
4. Click on `Run workflow` green button.

## 10. License

Copyright (C) 2021 Oazo Apps Limited, Licensed under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance with the License. You may obtain a copy
of the License at

> [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is
distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing permissions and limitations under the
License.

test