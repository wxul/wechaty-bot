import { ServiceContext } from '../Service';
import { getXiaobing, isXiaobing, saveFile } from '../../utils';
import { Contact, Room, log, FileBox } from 'wechaty';
import { MessageType } from 'wechaty-puppet';

interface sendOption {
  contact: Contact | Room;
  time: number;
}

let sendList: Array<sendOption> = [];

/**
 * 接受来自小冰的消息
 * @param context
 * @param next
 */
export async function xiaobingCallback(context: ServiceContext, next: () => void) {
  // log.info('xiaobingCallback Srv');
  const { message } = context;
  if (!message) return;
  if (isXiaobing(message)) {
    let l = sendList.shift();
    if (!l) return;
    while (Date.now() - l.time > 1000 * 10) {
      l = sendList.shift();
      if (!l) return;
    }
    // log.info('小冰', 'type: %s, atype: %s', message.type(), MessageType.Audio);
    switch (message.type()) {
      case MessageType.Text:
      case MessageType.Video:
      case MessageType.Image:
        await message.forward(l.contact);
        break;
      case MessageType.Audio:
        // log.info('小冰', 'audio !');
        let file = await saveFile(message);
        // log.info('小冰', 'audio save: %s', file);
        if (file) {
          await l.contact.say(FileBox.fromFile(file));
        }
        break;
      default:
        await message.forward(l.contact);
        break;
    }
  } else {
    next();
  }
}

/**
 * 处理所有的service最后的srv, 转发给小冰
 * @param context
 * @param next
 */
export async function defaultSrv(context: ServiceContext, next: () => void) {
  // log.info('defaultSrv Srv');
  const { message, options } = context;
  if (!message) return;
  let { parsedText } = options;
  let room = message.room();
  let contact = message.from();

  let xiaobing = await getXiaobing();
  if (xiaobing && parsedText) {
    await xiaobing.say(parsedText);
    if (room) {
      sendList.push({
        contact: room,
        time: Date.now()
      });
    } else if (contact) {
      sendList.push({
        contact: contact,
        time: Date.now()
      });
    }
  }
}
