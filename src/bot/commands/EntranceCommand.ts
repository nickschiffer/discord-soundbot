import { Message } from 'discord.js';

import Command from './base/Command';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import SoundUtil from '@util/SoundUtil';
import Config from '@config/Config';

export default class EntranceCommand implements Command {
  public readonly TRIGGERS = ['entrance'];
  public readonly USAGE = 'Usage: !entrance <sound>';
  public readonly db: DatabaseAdapter;
  public readonly soundUtil: SoundUtil;
  private readonly config: Config;

  constructor(config: Config, db: DatabaseAdapter, soundUtil: SoundUtil) {
    this.config = config;
    this.db = db;
    this.soundUtil = soundUtil;
  }

  public run(message: Message, params: string[]) {
    const [entranceSound] = params;
    if (!entranceSound) {
      this.db.entrances.remove(message.author.id);
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }
    

    const sounds = this.soundUtil.getSounds();
    if (!sounds.includes(entranceSound)){ 
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    this.db.entrances.add(message.author.id, entranceSound);
    if (this.config.deleteMessages){
      message.delete();
    }
  }
}
