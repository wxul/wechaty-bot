import { log } from "wechaty";
import qr from "qrcode-terminal";

export default function onScan(qrcode: string, status: number) {
  log.info("Scan", `status: ${status}, qrcodeUrl: ${qrcode}`);
  qr.generate(qrcode);
}
