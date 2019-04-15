import { Wechaty } from 'wechaty';
import { PuppetPuppeteer } from 'wechaty-puppet-puppeteer';

class WechatyBot {
  private static _bot: Wechaty;
  private constructor() {}

  static get Instance(): Wechaty {
    if (!WechatyBot._bot)
      WechatyBot._bot = Wechaty.instance({
        profile: 'default',
        puppet: new PuppetPuppeteer()
      });
    return WechatyBot._bot;
  }
}

export default WechatyBot;
