import { ServiceContext } from "../Service";

export default function(context: ServiceContext, next: () => void) {
  const { message } = context;
  if (!message) return;
  if (message.self()) return;
  next();
}
