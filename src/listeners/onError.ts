import { log } from 'wechaty';

export default async function onError(err: Error) {
    log.error('Error', err.message);
}
