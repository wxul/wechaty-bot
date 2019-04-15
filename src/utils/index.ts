import { Message } from "wechaty";
import { resolve } from 'path';
import WechatyBot from '../bot';

const config = require(resolve(__dirname, '../../private_config.json'));

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
  })
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
  })
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
