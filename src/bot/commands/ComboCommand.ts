import { Message } from 'discord.js';

import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import localize from '@util/i18n/localize';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';

export default class ComboCommand implements Command {
  public readonly TRIGGERS = ['combo'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !combo <sound1> ... <soundN>';

  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run(message: Message, params: string[]) {
    if (params.length < this.NUMBER_OF_PARAMETERS) {
      message.author.send(this.USAGE);
      return;
    }

    const { voiceChannel } = message.member;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    const sounds = getSounds();

    params.forEach(sound => {
      if (!sounds.includes(sound)) return;

      const item = new QueueItem(sound, voiceChannel, message);
      this.queue.add(item);
    });
  }
}