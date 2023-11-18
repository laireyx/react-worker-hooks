jest.dontMock('selenium-webdriver');

import path from 'node:path';

import {
  Browser,
  Builder,
  By,
  type WebDriver,
  Condition,
} from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

describe('Simple worker test', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(
        new chrome.Options().addArguments('--disable-web-security'),
      )
      .build();

    await driver.get(path.join(__dirname, 'assets/index.html'));

    await driver.wait(
      new Condition('script load', () =>
        driver.findElements(By.id('prepared')).then(({ length }) => length > 0),
      ),
      2000,
    );
  });

  afterAll(async () => {
    await driver.close();
  });

  it('startWorker() test', () =>
    expect(
      driver.executeAsyncScript(
        `window.test.startWorker().then(arguments[arguments.length - 1]);`,
      ),
    ).resolves.toBe(true));

  it('Simple ping-pong test', () =>
    expect(
      driver.executeAsyncScript(
        `window.test.ping().then(arguments[arguments.length - 1]);`,
      ),
    ).resolves.toBe('pong 123'));
});
