import { ServiceContext } from "../Service";
import { MessageType } from "wechaty-puppet";
import { log } from "wechaty";
import { SensitiveWordInstance } from "../../utils/sensitive-word";

/**
 * 敏感词屏蔽
 * @param context
 * @param next
 */
export default function(context: ServiceContext, next: () => void) {
  const { message } = context;
  if (!message) return;
  if (message.self()) return;

  if (message.type() === MessageType.Text) {
    const filterd = SensitiveWordInstance.filterText(message.text());
    if (filterd && filterd.length > 0) {
      log.info("敏感词", "检测到敏感词:" + filterd.join(","));
      return;
    } else {
      next;
    }
  } else {
    next();
  }
}
