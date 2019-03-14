import { Message } from 'discord.js';

import Command from './base/Command';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import Sound from '@util/db/models/Sound';

import Config from '@config/Config';

export default class MostPlayedCommand implements Command {
  public readonly TRIGGERS = ['mostplayed'];
  private db: DatabaseAdapter;

  private readonly config: Config;

  constructor(config: Config, db: DatabaseAdapter) {
    this.config = config;
    this.db = db;
  }

  public run(message: Message) {
    const formattedMessage = this.getFormattedMessage();
    if (!formattedMessage){ 
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    message.channel.send(formattedMessage);
    if (this.config.deleteMessages){
      message.delete();
    }
  }

  private getFormattedMessage() {
    const sounds = this.db.sounds.mostPlayed();
    if (!sounds.length) return;

    const longestSound = this.findLongestWord(sounds.map(sound => sound.name));
    const longestCount = this.findLongestWord(sounds.map(sound => String(sound.count)));
    return this.formatSounds(sounds, longestSound.length, longestCount.length);
  }

  private findLongestWord(array: string[]) {
    return array.reduce((a, b) => a.length > b.length ? a : b);
  }

  private formatSounds(sounds: Sound[], soundLength: number, countLength: number) {
    const lines = sounds.map(sound => {
      const spacesForSound = ' '.repeat(soundLength - sound.name.length + 1);
      const spacesForCount = ' '.repeat(countLength - String(sound.count).length);
      return `${sound.name}:${spacesForSound}${spacesForCount}${sound.count}`;
    });
    return ['```', ...lines, '```'].join('\n');
  }
}
