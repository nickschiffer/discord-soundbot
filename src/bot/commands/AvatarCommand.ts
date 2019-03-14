import { ClientUser, Message, Permissions } from 'discord.js';

import UserCommand from './base/UserCommand';

import Config from '@config/Config';
import LocaleService from '@util/i18n/LocaleService';

export default class AvatarCommand implements UserCommand {
  public readonly TRIGGERS = ['avatar'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !avatar [remove]';

  private readonly config: Config;
  private readonly localeService: LocaleService;
  private user!: ClientUser;

  constructor(config: Config, localeService: LocaleService) {
    this.config = config;
    this.localeService = localeService;
  }

  public setClientUser(user: ClientUser) {
    this.user = user;
  }

  public run(message: Message, params: string[]) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)){
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    if (params.length === this.NUMBER_OF_PARAMETERS && params[0] === 'remove') {
      this.user.setAvatar('');
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    if (message.attachments.size === 0) {
      this.listAvatar(message);
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    if (message.attachments.size !== 1) {
      message.author.send(this.USAGE);
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    this.user.setAvatar(message.attachments.first().url)
             .catch(() => message.channel.send(this.localeService.t('commands.avatar.errors.tooFast')));
             if (this.config.deleteMessages){
              message.delete();
            }
  }

  private listAvatar(message: Message) {
    if (this.user.avatarURL === null) {
      message.author.send(
        this.localeService.t('commands.avatar.errors.noAvatar', { prefix: this.config.prefix }));
        if (this.config.deleteMessages){
          message.delete();
        }
      return;
    }

    message.author.send(this.localeService.t('commands.avatar.url', { url: this.user.avatarURL }));
    if (this.config.deleteMessages){
      message.delete();
    }
  }
}
