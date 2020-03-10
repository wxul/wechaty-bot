import { ServiceContext } from "../Service";
import { isAdmin, isXiaobing } from '../../utils';
import { Contact, log } from "wechaty";
import { MessageType } from "wechaty-puppet";

/**
 * 预处理文本, 判断是否来自管理员的消息
 * @param context
 * @param next
 */
export default function (context: ServiceContext, next: () => void) {
  // log.info('Pre Srv');
  const { message } = context;
  if (!message) return;
  if (message.self()) return;
  context.options = context.options || {};
  // let room = message.room();
  // let msgText = message.text();

  context.options.isAdmin = isAdmin(message);
  // context.options.isXiaobing = isXiaobing(message);

  // let reg = /^\@女仆\s/;
  // if (message.type() == MessageType.Text && (!room || (room && reg.test(msgText)))) {
  //   log.info('Text Receive', 'text: %s', msgText);
  //   let text = room ? msgText.replace(reg, '').trim() : msgText.trim();
  //   context.options.parsedText = text;

  // }
  next();
};
