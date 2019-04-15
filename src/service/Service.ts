import WechatyBot from '../bot';
import { Message, log } from 'wechaty';

export interface ServiceFunc {
  (context: ServiceContext): void | Promise<any>;
}

export interface ServiceContext {
  Bot: WechatyBot;
  message: Message;
  options?: object;
}

class BotTextService {
  private _services: Array<ServiceFunc>;
  private _bot: WechatyBot;

  constructor() {
    this._services = [];
    this._bot = WechatyBot.Instance;
  }

  add(service: ServiceFunc): void {
    this._services.push(service);
  }

  async parse(message: Message) {
    let context: ServiceContext = {
      Bot: this._bot,
      message
    };

    for (var k in this._services) {
      let foo = this._services[k];
      await foo.call(null, context);
    }

    log.info('Parse end!');
  }
}

export default BotTextService;
