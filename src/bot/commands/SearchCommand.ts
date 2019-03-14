import { Message } from 'discord.js';

import Command from './base/Command';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import LocaleService from '@util/i18n/LocaleService';
import SoundUtil from '@util/SoundUtil';
import Config from '@config/Config';

export default class SearchCommand implements Command {
  public readonly TRIGGERS = ['search'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !search <tag>';

  private readonly localeService: LocaleService;
  private readonly soundUtil: SoundUtil;
  private readonly db: DatabaseAdapter;
  private readonly config: Config;

  constructor(config: Config, localeService: LocaleService, soundUtil: SoundUtil, db: DatabaseAdapter) {
    this.config = config;
    this.localeService = localeService;
    this.soundUtil = soundUtil;
    this.db = db;
  }

  public run(message: Message, params: string[]) {
    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.author.send(this.USAGE);
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    const tag = params.shift()!;
    const results = this.soundUtil.getSounds().filter(sound => sound.includes(tag));
    this.db.sounds.withTag(tag).forEach(sound => results.push(sound));

    if (!results.length) {
      message.author.send(this.localeService.t('commands.search.notFound'));
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    const uniqueResults = [...new Set(results)].sort();
    message.author.send(uniqueResults.join('\n'));
    if (this.config.deleteMessages){
      message.delete();
    }
  }
}
