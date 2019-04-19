import { ServiceContext } from '../Service';
import { log } from 'wechaty';
import { MessageType } from 'wechaty-puppet';
import get from 'lodash.get';
import Key from '../key/Key';
import toutiao from '../key/toutiao';

const keySrv = new Key();
keySrv.use(new toutiao());

/**
 * 关键字处理
 * @param context
 * @param next
 */
export default async function(context: ServiceContext, next: () => void) {
  // log.info('Pre Srv');
  const { message } = context;
  if (!message) return;
  if (message.type() !== MessageType.Text) return next();

  let text = get(context, 'options.parsedText', false);
  if (!text) return next();
  let result = await keySrv.parse(text);
  if (result) {
    return await message.say(result);
  } else {
    return next();
  }
}
