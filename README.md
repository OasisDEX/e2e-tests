
# Repository with E2E tests for Summer.fi DeFi web application

## Introduction
This repository contains a repository of tests for the e2e testing of the Summer.fi DeFi web application.

For now, all the e2e tests in this repository are for scenarios in which the wallet is not connected. 

The tests and framework have been written using Playwright and Typescript.

## Installation
First, install the programs required to run the application:

- [Node.js](https://nodejs.org/en/download/)


Next, clone this repository:
```
git clone xxxxxxxx
```

Go to the repo directory and install the dependencies:
```
yarn install
```


## Environment variables
To run the tests locally you will need to create a `.env` file. You can create a copy from `.env.example` file by running: 
```
cp .env.example .env
```

The following environment variable is **mandatory**:

| Variable | Description |
| --- | --- |
| BASE_URL | This is the base url used to run the tests. As per `.env.example` file, you'll probably use `https://staging.summer.fi` as base url|


You can also use these other environment variables:

| Variable | Default | Description |
| --- | --- | -- |
| FULLY_PARALLEL | false | Playwright Test runs tests in parallel. In order to achieve that, it runs several worker processes that run at the same time. By default, **test files** are run in parallel. However, tests in a single file are run in order, in the same worker process. You can configure entire test run to concurrently execute all tests in all files using this option.|
| WORKERS | 1 | Number of workers used to run the tests. To run the tests in pralallel you need to use more than 1 workers.  |
| TIMEOUT | 30000 | Timeout for each test in milliseconds. |
| RETRIES | 0 | The maximum number of retry attempts given to failed tests. By default failing tests are not retried. |
| HEADLESS | true | Whether to run browser in headless mode. |



## Running the tests
1. Create `.env` file.

2. Set `BASE_URL` in `.env` file. For example,  `BASE_URL='https://staging.summer.fi'`

3. Run tests by running:
- Run all tests in all browsers:
`yarn test:e2e`
- Run all tests only in chromium:
`yarn test:e2e:chromium`
- Run all tests only in firefox:
`yarn test:e2e:firefox`
- Run all tests only in webkit:
`yarn test:e2e:webkit`
- Run only **regression** tests *(they run only in chromium)*:
`yarn test:e2e:regression`

## Running the tests report
After running one or more tests you can run the following to open a test report in the browser:
```
yarn test:report
```  

## Tags 
Tests can be tagged so that we  can only run the tests that have the certain tag. 
At the moment we are using the following tags:
- `@regression`: Add this tag to all the tests that you should be part of the regression test suite.

## Projects
A project is logical group of tests running with the same configuration. We use projects so we can run tests on different browsers and devices. Projects are configured in the playwright.config.

At the moment we are using the following projects:
- `chromium`
- `firefox`
- `webkit`