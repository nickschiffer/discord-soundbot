import fs from 'fs';

import { Message } from 'discord.js';

import Command from './base/Command';

import SoundUtil from '@util/SoundUtil';

import Config from '@config/Config';

export default class LastAddedCommand implements Command {
  public readonly TRIGGERS = ['lastadded'];
  private readonly AMOUNT = 5;

  private readonly soundUtil: SoundUtil;

  private readonly config: Config;

  constructor(config: Config, soundUtil: SoundUtil) {
    this.config = config;
    this.soundUtil = soundUtil;
  }

  public run(message: Message) {
    message.author.send(['```', ...this.getLastAddedSounds(), '```'].join('\n'));
    if (this.config.deleteMessages){
      message.delete();
    }
  }

  private getLastAddedSounds() {
    return this.soundUtil.getSoundsWithExtension()
      .map(sound => ({
        name: sound.name,
        creation: fs.statSync(this.soundUtil.getPathForSound(sound.name)).birthtime
      }))
      .sort((a, b) => b.creation.valueOf() - a.creation.valueOf())
      .slice(0, this.AMOUNT)
      .map(sound => sound.name);
  }
}
