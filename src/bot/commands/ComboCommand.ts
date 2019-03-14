import { Message, VoiceChannel } from 'discord.js';

import Command from './base/Command';

import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import SoundUtil from '@util/SoundUtil';
import VoiceChannelFinder from './helpers/VoiceChannelFinder';
import Config from '@config/Config';

export default class ComboCommand implements Command {
  public readonly TRIGGERS = ['combo'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !combo <sound1> ... <soundN>';
  public readonly config: Config;

  private readonly soundUtil: SoundUtil;
  private readonly queue: SoundQueue;
  private readonly voiceChannelFinder: VoiceChannelFinder;
  private sounds!: string[];

  constructor(config: Config, soundUtil: SoundUtil, queue: SoundQueue, voiceChannelFinder: VoiceChannelFinder) {
    this.config = config;
    this.soundUtil = soundUtil;
    this.queue = queue;
    this.voiceChannelFinder = voiceChannelFinder;
  }

  public run(message: Message, params: string[]) {
    if (params.length < this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
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

    this.sounds = this.soundUtil.getSounds();
    this.addSoundsToQueue(params, voiceChannel, message);
    if (this.config.deleteMessages){
      message.delete();
    }
  }

  private addSoundsToQueue(sounds: string[], voiceChannel: VoiceChannel, message: Message) {
    sounds.forEach(sound => this.addSoundToQueue(sound, voiceChannel, message));
  }

  private addSoundToQueue(sound: string, voiceChannel: VoiceChannel, message: Message) {
    if (!this.sounds.includes(sound)) return;
    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}
