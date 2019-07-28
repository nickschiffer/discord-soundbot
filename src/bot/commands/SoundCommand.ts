import { Message } from 'discord.js';

import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import { existsSound } from '@util/SoundUtil';
import Command from './base/Command';
import getVoiceChannelFromAuthor from './helpers/getVoiceChannelFromAuthor';
import Config from '@config/Config';

export default class SoundCommand implements Command {
  public readonly TRIGGERS = [];

  private readonly queue: SoundQueue;
  private readonly config: Config;

  constructor(queue: SoundQueue, config: Config) {
    this.queue = queue;
    this.config = config;
  }

  public run(message: Message) {
    const sound = message.content;
    if (!existsSound(sound)){
      message.author.send(`sound not found, try ${this.config.prefix}sounds for a list of sounds.`); 
      return;
    }

    const voiceChannel = getVoiceChannelFromAuthor(message);
    if (!voiceChannel) return;

    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}
