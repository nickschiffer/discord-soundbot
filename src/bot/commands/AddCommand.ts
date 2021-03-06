import { Message, Permissions } from 'discord.js';

import Command from './base/Command';

import AttachmentDownloader from './helpers/downloader/AttachmentDownloader';
import YoutubeDownloader from './helpers/downloader/YoutubeDownloader';
import Config from '@config/Config';

export default class AddCommand implements Command {
  public readonly TRIGGERS = ['add'];
  readonly config: Config;
  private readonly attachmentDownloader: AttachmentDownloader;
  private readonly youtubeDownloader: YoutubeDownloader;

  constructor(config: Config, attachmentDownloader: AttachmentDownloader, youtubeDownloader: YoutubeDownloader) {
    this.attachmentDownloader = attachmentDownloader;
    this.youtubeDownloader = youtubeDownloader;
    this.config = config;
  }

  public run(message: Message) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)){
      message.author.send(`Only mods can do that`);
      return;
    }
    if (!message.attachments.size) {
      this.youtubeDownloader.handle(message);
      return;
    }

    this.attachmentDownloader.handle(message);
  }
}
