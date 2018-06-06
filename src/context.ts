import { Config } from './config/config.interface';
import { Message } from './utils/message.util';

export interface Context {
  message: Message;
  config: Config;
}
