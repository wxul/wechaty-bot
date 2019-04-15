import WechatyBot from '../bot';
import { Message, log } from 'wechaty';

export interface ServiceFunc {
  (context: ServiceContext, next: () => void): void | Promise<any>;
}

export interface ServiceContext {
  Bot: WechatyBot;
  message: Message | null;
  options: ServiceOptions;
}

export interface ServiceOptions {
  isAdmin?: boolean;
  isXiaobing?: boolean;
  parsedText?: string;
}

class MessageService {
  private _services: Array<ServiceFunc>;
  private _srv?: Array<ServiceFunc>;
  private _bot: WechatyBot;
  private _context?: ServiceContext;
  private _message?: Message;

  constructor() {
    this._services = [];
    this._bot = WechatyBot.Instance;
  }

  use(service: ServiceFunc): void {
    this._services.push(service);
  }

  next() {
    // log.info('next');
    if (this._srv && this._srv.length > 0) {
      let ware = this._srv.shift();
      if (ware) {
        ware.call(this, this._context || {
          Bot: this._bot,
          message: this._message || null,
          options: {}
        }, this.next.bind(this))
      }
    }
  }

  parse(message: Message) {
    // log.info('Begin parse');
    this._srv = this._services.slice(0);
    this._message = message;
    this._context = {
      Bot: this._bot,
      message,
      options: {}
    };

    this.next();
  }
}

export default MessageService;
