import { log } from 'wechaty';
import WechatyBot from './bot';

WechatyBot.Instance.on('scan', './listeners/onScan')
    .on('login', './listeners/onLogin')
    .on('message', './listeners/onMessage')
    .on('logout', './listeners/onLogout')
    .on('error', './listeners/onError')
    .start()
    .catch(async function(e) {
        log.error(`Init() fail: ${e}.`);
        await WechatyBot.Instance.stop();
        process.exit(1);
    });
