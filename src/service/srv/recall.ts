import { ServiceContext } from "../Service";
import { MessageType } from "wechaty-puppet";
import { log } from 'wechaty';
import { resolve } from 'path';

/**
 * 处理撤回消息类型
 * @param context 
 * @param next 
 */
export default async function (context: ServiceContext, next: () => void) {
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
      let recalledFrom = recalledMsg.from();
      let recalledType = recalledMsg.type();
      switch (recalledType) {
        case MessageType.Text:
          log.info('Recalled', 'room: %s, from: %s, type: %s, text: %s', topic, recalledFrom ? recalledFrom.name() : 'no', MessageType[recalledType], recalledMsg.text());
          break;
        case MessageType.Video:
        case MessageType.Audio:
        case MessageType.Image:
          log.info('Recalled', 'room: %s, from: %s, type: %s', topic, recalledFrom ? recalledFrom.name() : 'no', MessageType[recalledType]);
          let file = await recalledMsg.toFileBox();
          file.toFile(resolve(process.env.ROOT_DIR, 'files', 'asdasdasd.jpg'));
          break;
        default:
          log.info('Recalled', 'room: %s, from: %s, type: %s', topic, recalledFrom ? recalledFrom.name() : 'no', MessageType[recalledType]);
          break;
      }
    }
  } else {
    next();
  }
};