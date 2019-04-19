import { Message, log } from 'wechaty';
import { MessageType } from 'wechaty-puppet';
import { isAdmin, isXiaobing, forwardToAdmins, getMessageFromContactName } from '../utils';
import Service from '../service/Service';
import RecallSrv from '../service/srv/recall';
import PreSrv from '../service/srv/pre';
import { xiaobingCallback, defaultSrv } from '../service/srv/xiaobing';
import TestSrv from '../service/srv/test';
import KeySrv from '../service/srv/key';

const service = new Service();
service.use(RecallSrv);
service.use(PreSrv);

if (process.env.DEBUG) {
  service.use(TestSrv);
}

service.use(xiaobingCallback);
service.use(KeySrv);

service.use(defaultSrv);

export default async function onMessage(message: Message) {
  try {
    const type = message.type();
    const fromUserName = (await getMessageFromContactName(message)) || 'no';
    log.info('Message', 'id: %s, type: %s, from: %s', message.id, MessageType[type], fromUserName);

    service.parse(message);

    // const IsXiaobing = isXiaobing(message);
    // if (IsXiaobing) {
    //   await forwardToAdmins(message);
    //   return;
    // }

    // const IsAdmin = isAdmin(message);

    // if (IsAdmin) {
    //   let contact = await message.wechaty.Contact.find({
    //     name: '小冰'
    //   });
    //   log.info('Forward', contact && contact.toString());
    //   if (contact) await message.forward(contact);
    // }

    // switch (type) {
    //   // 文本
    //   case MessageType.Text:
    //     log.info('Text', 'content: %s', message.text());
    //     break;
    //   // 音视频+图片
    //   case MessageType.Video:
    //   case MessageType.Image:
    //   case MessageType.Audio:
    //     log.info('Media');
    //     break;
    //   // 撤回消息
    //   case MessageType.Recalled:
    //     let topic = room ? await room.topic() : 'none';
    //     let recalledMsg = await message.toRecalled();

    //     if (!recalledMsg) {
    //       log.info('Recalled', 'room: %s, no result', topic);
    //     } else {
    //       let recalledFrom = recalledMsg.from();
    //       let recalledType = recalledMsg.type();
    //       if (recalledType == MessageType.Text) {
    //         log.info('Recalled', 'room: %s, from: %s, type: %s, text: %s', topic, recalledFrom ? recalledFrom.name() : 'none', MessageType[recalledType], recalledMsg.text());
    //       } else {
    //         log.info('Recalled', 'room: %s, from: %s, type: %s', topic, recalledFrom ? recalledFrom.name() : 'none', MessageType[recalledType]);
    //       }
    //     }

    //     break;
    //   default:
    //     log.info('Message Type', `unsurpotted type: ${MessageType[type]}`);
    //     break;
    // }
  } catch (error) {
    log.error('Message Error', error);
  }
}
