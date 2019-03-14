import { Message, Permissions } from 'discord.js';

import Command from './base/Command';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import LocaleService from '@util/i18n/LocaleService';
import SoundUtil from '@util/SoundUtil';
import Config from '@config/Config';

export default class TagCommand implements Command {
  public readonly TRIGGERS = ['tag'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !tag <sound> [<tag> ... <tagN> | clear]';

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
    if (params.length < this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    const sound = params.shift()!;
    if (!this.soundUtil.getSounds().includes(sound)) {
      message.channel.send(this.localeService.t('commands.tag.notFound', { sound }));
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    if (!params.length) {
      const tags = this.db.sounds.listTags(sound).join(', ');
      message.author.send(this.localeService.t('commands.tag.found', { sound, tags }));
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    if (params[0] === 'clear') {
      if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;
      this.db.sounds.clearTags(sound);
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    this.db.sounds.addTags(sound, params);
    if (this.config.deleteMessages){
      message.delete();
    }
  }
}
