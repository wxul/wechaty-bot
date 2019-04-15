import { log } from 'wechaty';

export default function onScan(qrcode: string, status: number) {
  let loginUrl = qrcode.replace('qrcode', 'l');
  log.info('Scan', `status: ${status}, qrcodeUrl: ${loginUrl}`);

  if (status === 0) {
    require('qrcode-terminal').generate(loginUrl);
  }
}
