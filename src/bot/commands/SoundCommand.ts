import { Message } from 'discord.js';

import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import localize from '@util/i18n/localize';
import { existsSound } from '@util/SoundUtil';
import Command from './base/Command';
import Config from '@config/Config';

export default class SoundCommand implements Command {
  public readonly TRIGGERS = [];
  private readonly config: Config;

  private readonly queue: SoundQueue;

  constructor(config: Config, queue: SoundQueue) {
    this.queue = queue;
    this.config = config;
  }

  public run(message: Message) {
    const sound = message.content;
    if (!existsSound(sound)) {
    message.author.send(`sound not found, try ${this.config.prefix}sounds for a list of sounds.`); 
    return;  
  }
    const { voiceChannel } = message.member;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}