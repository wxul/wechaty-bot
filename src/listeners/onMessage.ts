import { Message, log } from "wechaty";
import { MessageType } from "wechaty-puppet";
import {
  isAdmin,
  isXiaobing,
  forwardToAdmins,
  getMessageFromContactName
} from "../utils";
import Service from "../service/Service";
import RecallSrv from "../service/srv/recall";
// import PreSrv from '../service/srv/pre';
// import { xiaobingCallback, defaultSrv } from '../service/srv/xiaobing';
import TestSrv from "../service/srv/test";
// import KeySrv from '../service/srv/key';
import repeatSrv from "../service/srv/repeat";
import sensitiveSrv from "../service/srv/sensitive";
import { SensitiveWordInstance } from "../utils/sensitive-word";
import { join } from "path";

const service = new Service();
service.use(RecallSrv);
// service.use(PreSrv);

if (process.env.DEBUG) {
  service.use(TestSrv);
}

// service.use(xiaobingCallback);
// service.use(KeySrv);
// service.use(sensitiveSrv);
// service.use(defaultSrv);
// service.use(repeatSrv);

log.info("Init", "初始化敏感词库...");
SensitiveWordInstance.buildMapFromFile(join(__dirname, "../../敏感词"));
log.info("Init", "已初始化敏感词库！");

export default async function onMessage(message: Message) {
  try {
    const type = message.type();
    const fromUserName = (await getMessageFromContactName(message)) || "no";
    log.info(
      "Message",
      "id: %s, type: %s, from: %s",
      message.id,
      MessageType[type],
      fromUserName
    );

    service.parse(message);
  } catch (error) {
    log.error("Message Error", error);
  }
}
