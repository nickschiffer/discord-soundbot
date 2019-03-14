import { Attachment, Message } from 'discord.js';

import Command from './base/Command';

import SoundUtil from '@util/SoundUtil';
import Config from '@config/Config';

export default class DownloadCommand implements Command {
  public readonly TRIGGERS = ['download'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !download <sound>';
  public readonly config: Config;

  private readonly soundUtil: SoundUtil;

  constructor(config: Config, soundUtil: SoundUtil) {
    this.soundUtil = soundUtil;
    this.config = config;
  }

  public run(message: Message, params: string[]) {
    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    const sound = params[0];
    if (!this.soundUtil.soundExists(sound)){ 
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    const attachment = new Attachment(this.soundUtil.getPathForSound(sound));
    message.channel.send(attachment);
  }
}
