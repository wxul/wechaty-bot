import { ServiceContext } from "../Service";
import { getAdmins, prob } from "../../utils";
import { MessageType } from "wechaty-puppet";
import { Room } from "wechaty";

const Prob = 0.1; // 10%
const say = function(room: Room, text: string) {
  room.say(text);
};

const probSay = prob(Prob, say);

/**
 * 复读
 * @param context
 * @param next
 */
export default async function(context: ServiceContext, next: () => void) {
  const { message } = context;
  if (!message) return;
  if (message.self()) return;

  const room = message.room();
  const admins = await getAdmins();
  if (
    message.type() === MessageType.Text &&
    room &&
    admins &&
    admins.length &&
    (await room.has(admins[0]))
  ) {
    const msgText = message.text();
    // 敏感词屏蔽
    // TODO

    // 概率执行
    probSay(room, msgText);
  }

  next();
}
