import { log } from 'wechaty';
import { ContactSelf } from 'wechaty/dist/src/user';
// import schedule from 'node-schedule';

export default async function onLogout(user: ContactSelf) {
    log.info('Logout', `${user} logout`);
}
