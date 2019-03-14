import { Message } from 'discord.js';

import Command from './base/Command';

import SoundQueue from '@queue/SoundQueue';

import Config from '@config/Config';

export default class StopCommand implements Command {
  public readonly TRIGGERS = ['leave', 'stop'];
  private readonly queue: SoundQueue;
  private readonly config: Config;

  constructor(config: Config, queue: SoundQueue) {
    this.config = config;
    this.queue = queue;
  }

  public run(message: Message) {
    this.queue.clear();
    const voiceConnection = message.guild.voiceConnection;
    if (voiceConnection) voiceConnection.disconnect();
    if (this.config.deleteMessages){
      message.delete();
    }
  }
}
