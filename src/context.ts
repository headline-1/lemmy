import { Config } from './config';
import { Message } from './utils/message';

export interface Context {
  message: Message;
  config: Config;
}
