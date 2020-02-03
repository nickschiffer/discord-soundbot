import { Message } from 'discord.js';
import '../discord/Message';

import Config from '@config/Config';
import * as ignoreList from '@util/db/IgnoreList';
import CommandCollection from './CommandCollection';

export default class MessageHandler {
  private readonly config: Config;
  private readonly commands: CommandCollection;

  constructor(config: Config, commands: CommandCollection) {
    this.config = config;
    this.commands = commands;
  }

  public handle(message: Message) {
    if (!this.isValidMessage(message)) return;

    const messageToHandle = message;
    messageToHandle.content = message.content.substring(this.config.prefix.length);

    if (this.config.deleteMessages) {
      message.delete();
    }
    
    this.commands.execute(message);

  }

  private isValidMessage(message: Message) {
    if (!message.hasPrefix(this.config.prefix)){
      return false;
    }

    if (message.isDirectMessage()){
      message.author.send(`DM support still in development :/`);
      return false;
    }

    if (message.author.bot){
      return false;
    }

    if (!message.member){
      message.author.send(`Doesn't look like you're a member`);
      message.delete();
      return false;
    }

    if (ignoreList.exists(message.author.id)) {
      message.author.send(`You don't have permission to do that.`);
      message.delete();
      return false;
  }

    return true;
    
    
    
    return (
      !message.author.bot &&
      !message.isDirectMessage() &&
      message.hasPrefix(this.config.prefix) &&
      !ignoreList.exists(message.author.id)
    );
  }
}
