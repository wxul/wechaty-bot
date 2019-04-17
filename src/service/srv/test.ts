import { ServiceContext } from '../Service';
import { Contact, log, FileBox } from 'wechaty';
import { MessageType } from 'wechaty-puppet';
import get from 'lodash.get';
import fs from 'fs';
import { saveFile } from '../../utils';

/**
 * 预处理文本, 判断是否来自管理员的消息
 * @param context
 * @param next
 */
export default async function(context: ServiceContext, next: () => void) {
  log.info('Test Srv');
  if (!process.env.DEBUG) return next();
  
  const { message } = context;
  if (!message) return;

  // #region test save/send file
  let isAdmin = get(context, 'options.isAdmin', false);
  if (!isAdmin) return next();
  let t = message.type();
  if ([MessageType.Image, MessageType.Audio, MessageType.Video].indexOf(t) == -1) return next();

  let path = await saveFile(message);
  console.log('saved!', path);
  if (path) {
    console.log(fs.existsSync(path));
    await message.say(FileBox.fromFile(path));
  }
  // #endregion
}
