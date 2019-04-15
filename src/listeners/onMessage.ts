import { Message, log } from 'wechaty';
import { MessageType } from 'wechaty-puppet';

export default async function onMessage(message: Message) {
  try {
    const from = message.from();
    const type = message.type();
    log.info('Message', 'id: %s, type: %s, from: %s', message.id, MessageType[type], from ? from.name() : 'none');

    const room = message.room();

    switch (type) {
      // 文本
      case MessageType.Text:
        log.info('Text', 'content: %s', message.text());
        break;
      // 音视频+图片
      case MessageType.Video:
      case MessageType.Image:
      case MessageType.Audio:
        log.info('Media');
        break;
      // 撤回消息
      case MessageType.Recalled:
        let topic = room ? await room.topic() : 'none';
        let recalledMsg = await message.toRecalled();

        if (!recalledMsg) {
          log.info('Recalled', 'room: %s, no result', topic);
        } else {
          let recalledFrom = recalledMsg.from();
          let recalledType = recalledMsg.type();
          if (recalledType == MessageType.Text) {
            log.info('Recalled', 'room: %s, from: %s, type: %s, text: %s', topic, recalledFrom ? recalledFrom.name() : 'none', MessageType[recalledType], recalledMsg.text());
          } else {
            log.info('Recalled', 'room: %s, from: %s, type: %s', topic, recalledFrom ? recalledFrom.name() : 'none', MessageType[recalledType]);
          }
        }

        break;
      default:
        log.info('Message Type', `unsurpotted type: ${MessageType[type]}`);
        break;
    }
  } catch (error) {
    log.error('Message Error', error);
  }
}
