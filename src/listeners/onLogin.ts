import { log } from 'wechaty';
import { ContactSelf } from 'wechaty/dist/src/user';
// import schedule from 'node-schedule';

export default async function onLogin(user: ContactSelf) {
  log.info('Login', `${user} login`);
}
