import { Wechaty } from "wechaty";

class WechatyBot {
  private static _bot: Wechaty;
  private constructor() {}

  static get Instance(): Wechaty {
    if (!WechatyBot._bot)
      WechatyBot._bot = Wechaty.instance({
        name: "wx-bot"
      });
    return WechatyBot._bot;
  }
}

export default WechatyBot;
