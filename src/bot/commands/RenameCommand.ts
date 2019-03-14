import fs from 'fs';

import { Message, Permissions } from 'discord.js';

import Command from './base/Command';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import LocaleService from '@util/i18n/LocaleService';
import SoundUtil from '@util/SoundUtil';
import Config from '@config/Config';

export default class RenameCommand implements Command {
  public readonly TRIGGERS = ['rename'];
  public readonly NUMBER_OF_PARAMETERS = 2;
  public readonly USAGE = 'Usage: !rename <old> <new>';

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
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)){ 
      if (this.config.deleteMessages){
        message.delete();
      }
      return
    };

    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    const [oldName, newName] = params;
    const sounds = this.soundUtil.getSounds();

    if (!sounds.includes(oldName)) {
      message.channel.send(this.localeService.t('commands.rename.notFound', { oldName }));
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    if (sounds.includes(newName)) {
      message.channel.send(this.localeService.t('commands.rename.exists', { newName }));
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    const extension = this.soundUtil.getExtensionForSound(oldName);
    const oldFile = `sounds/${oldName}.${extension}`;
    const newFile = `sounds/${newName}.${extension}`;
    fs.renameSync(oldFile, newFile);
    this.db.sounds.rename(oldName, newName);

    message.channel.send(this.localeService.t('commands.rename.success', { oldName, newName }));
    if (this.config.deleteMessages){
      message.delete();
    }
  }
}
