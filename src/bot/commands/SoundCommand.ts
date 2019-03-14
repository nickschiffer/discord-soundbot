import { Message } from 'discord.js';

import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import { existsSound } from '@util/SoundUtil';
import Command from './base/Command';
import getVoiceChannelFromAuthor from './helpers/getVoiceChannelFromAuthor';

export default class SoundCommand implements Command {
  public readonly TRIGGERS = [];

  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run(message: Message) {
    const sound = message.content;
    if (!existsSound(sound)){
      message.author.send(`sound not found, try [prefix]sounds for a list of sounds.`); 
      return;
    }

    const voiceChannel = getVoiceChannelFromAuthor(message);
    if (!voiceChannel) return;

    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}