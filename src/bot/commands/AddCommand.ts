import { Message } from 'discord.js';

import Command from './base/Command';

import AttachmentDownloader from './helpers/downloader/AttachmentDownloader';
import YoutubeDownloader from './helpers/downloader/YoutubeDownloader';
import Config from '@config/Config';

export default class AddCommand implements Command {
  public readonly TRIGGERS = ['add'];
  private readonly config: Config;
  private readonly attachmentDownloader: AttachmentDownloader;
  private readonly youtubeDownloader: YoutubeDownloader;

  constructor(config: Config, attachmentDownloader: AttachmentDownloader, youtubeDownloader: YoutubeDownloader) {
    this.attachmentDownloader = attachmentDownloader;
    this.youtubeDownloader = youtubeDownloader;
    this.config = config;
  }

  public run(message: Message) {
    if (!message.attachments.size) {
      this.youtubeDownloader.handle(message);
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    this.attachmentDownloader.handle(message);
    if (this.config.deleteMessages){
      message.delete();
    }
  }
}
