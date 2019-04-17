import { Message, FileBox, log } from 'wechaty';
import { resolve, format } from 'path';
import { FilePath } from './config';
import fs from 'fs';
import moment from 'moment';
import WechatyBot from '../bot';

const { ROOT_DIR } = process.env;
const config = ROOT_DIR ? require(resolve(ROOT_DIR, 'private_config.json')) : require(resolve(__dirname, '../../private_config.json'));

function isEqualContact(message: Message, nameList: string[]) {
  let from = message.from();
  if (!from) return false;
  let name = from.name();
  if (!name) return false;
  return nameList.indexOf(name) > -1;
}

async function getContact(nameList: string[]) {
  let bot = WechatyBot.Instance;

  let all = await bot.Contact.findAll();

  return all.filter(contact => {
    return config.admins.indexOf(contact.name()) > -1;
  });
}

/**
 * 消息是否来自管理员
 * @param message
 */
export function isAdmin(message: Message) {
  return isEqualContact(message, config.admins);
}

/**
 * 消息是否来自微软小冰
 * @param message
 */
export function isXiaobing(message: Message) {
  return isEqualContact(message, ['小冰']);
}

/**
 * 获取管理员联系人
 */
export async function getAdmins() {
  return await getContact(config.admins);
}

/**
 * 获取小冰
 */
export async function getXiaobing() {
  let bot = WechatyBot.Instance;
  let contacts = await bot.Contact.find({
    name: '小冰'
  });
  return contacts;
}

/**
 * 群发管理员
 * @param content
 */
export async function sayToAdmins(content: any) {
  let admins = await getAdmins();
  admins.forEach(async a => {
    await a.say(content);
  });
}

/**
 * 群转发管理员
 * @param message
 */
export async function forwardToAdmins(message: Message) {
  let admins = await getAdmins();
  admins.forEach(async a => {
    await message.forward(a);
  });
}

/**
 * 保存消息中的文件
 * @param message
 */
export async function saveFile(message: Message, filename?: string) {
  if (!fs.existsSync(FilePath)) {
    fs.mkdirSync(FilePath);
  }

  try {
    const file = await message.toFileBox();
    const contact = message.from();
    const room = message.room();
    const date = message.date();
    let name = file.name;
    if (contact) {
      name = contact.name() + '_' + name;
    }
    if (room) {
      let topic = await room.topic();
      name = topic + '_' + name;
    }
    name = moment(date).format('YYYY_MM_DD_HH_mm_ss') + '_' + name;
    log.info('SaveFile', 'path: %s', name);
    let filepath = resolve(FilePath, name);
    await file.toFile(filepath);
    return filepath;
  } catch (error) {
    log.error('SaveFile Error', error.message);
  }
}

/**
 * 获取消息来源用户名称
 * @param message
 */
export async function getMessageFromContactName(message: Message) {
  const contact = message.from();
  if (!contact) return null;
  const room = message.room();
  let userName;
  if (room) {
    userName = await room.alias(contact);
  }
  userName = userName || contact.name() || contact.weixin();

  return userName;
}
