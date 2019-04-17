import { ServiceContext } from '../Service';
import { MessageType } from 'wechaty-puppet';
import { log, FileBox, Message } from 'wechaty';
import { resolve } from 'path';
import { saveFile, sayToAdmins, getMessageFromContactName } from '../../utils';

/**
 * 处理撤回消息类型
 * @param context
 * @param next
 */
export default async function(context: ServiceContext, next: () => void) {
  // log.info('Recall Srv');
  const { message } = context;
  if (!message) return;
  if (message.type() == MessageType.Recalled) {
    let room = message.room();
    let topic = room ? await room.topic() : 'no';
    let recalledMsg = await message.toRecalled();

    if (!recalledMsg) {
      log.info('Recalled', 'room: %s, no result', topic);
    } else {
      let recalledType = recalledMsg.type();
      let fromUserName = (await getMessageFromContactName(message)) || 'no one';

      switch (recalledType) {
        case MessageType.Text:
          log.info('Recalled', 'room: %s, from: %s, type: %s, text: %s', topic, fromUserName, MessageType[recalledType], recalledMsg.text());
          sayToAdmins(await messageFormat(recalledMsg));
          break;
        case MessageType.Video:
        case MessageType.Audio:
        case MessageType.Image:
          log.info('Recalled', 'room: %s, from: %s, type: %s', topic, fromUserName, MessageType[recalledType]);
          // TODO
          let path = await saveFile(recalledMsg);
          if (path) {
            log.info('File Save', 'saved, path: %s', path);
            sayToAdmins(await messageFormat(recalledMsg));
            sayToAdmins(FileBox.fromFile(path));
          } else {
            log.info('File Save', 'failed');
          }

          break;
        default:
          log.info('Recalled', 'room: %s, from: %s, type: %s', topic, fromUserName, MessageType[recalledType]);
          break;
      }
    }
  } else {
    next();
  }
}

async function messageFormat(message: Message) {
  let isText = message.type() == MessageType.Text;
  let room = message.room();
  let topic = room ? await room.topic() : '';
  let fromUserName = (await getMessageFromContactName(message)) || 'no one';
  return `[${topic ? topic + '-' : ''}${fromUserName}]撤回了一条[${MessageType[message.type()]}]消息: ${isText ? message.text() : ''}`;
}
