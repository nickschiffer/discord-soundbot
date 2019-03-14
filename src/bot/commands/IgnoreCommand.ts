import { Message, Permissions } from 'discord.js';

import Command from './base/Command';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import LocaleService from '@util/i18n/LocaleService';
import UserFinder from './helpers/UserFinder';
import Config from '@config/Config';

export default class IgnoreCommand implements Command {
  public readonly TRIGGERS = ['ignore'];
  public readonly USAGE = 'Usage: !ignore <user>';
  private readonly localeService: LocaleService;
  private readonly db: DatabaseAdapter;
  private readonly userFinder: UserFinder;
  private readonly config: Config;

  constructor(config: Config, localeService: LocaleService, db: DatabaseAdapter, userFinder: UserFinder) {
    this.config = config;
    this.localeService = localeService;
    this.db = db;
    this.userFinder = userFinder;
  }

  public run(message: Message) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)){ 
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    this.userFinder.getUsersFromMentions(message, this.USAGE).forEach(user => {
      this.db.ignoreList.add(user.id);
      message.channel.send(this.localeService.t('commands.ignore.add', { user: user.username }));
    });
    if (this.config.deleteMessages){
      message.delete();
    }
  }
}
