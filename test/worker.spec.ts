jest.dontMock('selenium-webdriver');

import path from 'node:path';
import process from 'node:process';

import {
  Browser,
  Builder,
  By,
  type WebDriver,
  Condition,
} from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

describe('Worker instance test', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(
        new chrome.Options()
          .setChromeBinaryPath(process.env.CHROME_BINARY ?? '')
          .addArguments('--headless')
          .addArguments('--no-sandbox')
          .addArguments('--disable-dev-shm-usage')
          .addArguments('--disable-web-security'),
      )
      .build();

    await driver.get('file://' + path.join(__dirname, 'assets/index.html'));

    await driver.wait(
      new Condition('script load', () =>
        driver.findElements(By.id('prepared')).then(({ length }) => length > 0),
      ),
      2000,
    );
  }, 10000);

  afterAll(async () => {
    await driver.close();
  });

  it(
    'startWorker() test',
    () =>
      expect(
        driver.executeAsyncScript(
          `window.test.startWorker().then(arguments[arguments.length - 1]);`,
        ),
      ).resolves.toBe(true),
    10000,
  );

  it(
    'Ping-pong test',
    () =>
      expect(
        driver.executeAsyncScript(
          `window.test.ping().then(arguments[arguments.length - 1]);`,
        ),
      ).resolves.toBe('pong 123'),
    10000,
  );

  it(
    'Ping-pong test(Transferable-Primitive)',
    () =>
      expect(
        driver.executeAsyncScript(
          `window.test.pingTransferable().then(arguments[arguments.length - 1]);`,
        ),
      ).resolves.toBe(true),
    10000,
  );

  it(
    'Ping-pong test(Primitive-Tranferable)',
    () =>
      expect(
        driver.executeAsyncScript(
          `window.test.pongTransferable().then(arguments[arguments.length - 1]);`,
        ),
      ).resolves.toBe(true),
    10000,
  );

  it(
    'Ping-pong test(Tranferable-Tranferable)',
    () =>
      expect(
        driver.executeAsyncScript(
          `window.test.pingpongTransferable().then(arguments[arguments.length - 1]);`,
        ),
      ).resolves.toBe(true),
    10000,
  );
});
