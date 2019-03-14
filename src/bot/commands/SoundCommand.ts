import { Message } from 'discord.js';

import Command from './base/Command';

import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import SoundUtil from '@util/SoundUtil';
import VoiceChannelFinder from './helpers/VoiceChannelFinder';
import Config from '@config/Config';

export default class SoundCommand implements Command {
  public readonly TRIGGERS = [];

  private readonly soundUtil: SoundUtil;
  private readonly queue: SoundQueue;
  private readonly voiceChannelFinder: VoiceChannelFinder;
  private readonly config: Config;

  constructor(config: Config, soundUtil: SoundUtil, queue: SoundQueue, voiceChannelFinder: VoiceChannelFinder) {
    this.config = config;
    this.soundUtil = soundUtil;
    this.queue = queue;
    this.voiceChannelFinder = voiceChannelFinder;
  }

  public run(message: Message) {
    const sound = message.content;
    if (!this.soundUtil.soundExists(sound)){ 
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    const voiceChannel = this.voiceChannelFinder.getVoiceChannelFromMessageAuthor(message);
    if (!voiceChannel){ 
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    this.queue.add(new QueueItem(sound, voiceChannel, message));
    if (this.config.deleteMessages){
      message.delete();
    }
  }
}
