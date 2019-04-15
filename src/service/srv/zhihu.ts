import { ServiceContext } from "../Service";
import { Message } from "wechaty";

export default function (context: ServiceContext, next: () => void) {



  next();
};