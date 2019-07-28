import { ClientUser, Message } from 'discord.js';

import Command from './commands/base/Command';
import UserCommand from './commands/base/UserCommand';
import SoundCommand from './commands/SoundCommand';
import Config from '@config/Config';

export default class CommandCollection {
  private readonly triggers: Map<string, Command>;
  private readonly commands: Command[];
  private readonly soundCommand: SoundCommand;
  private readonly config: Config;

  constructor(commands: Command[], config: Config) {
    this.triggers = new Map();
    this.commands = [];
    this.soundCommand = commands.find(command => !command.TRIGGERS.length)! as SoundCommand;
    this.config = config;

    this.registerCommands(commands);
  }

  public registerCommands(commands: Command[]) {
    this.commands.push(...commands);
    commands.forEach(command => this.registerTriggers(command));
  }

  public registerUserCommands(user: ClientUser) {
    const userCommands = this.commands.filter(command => (command as UserCommand).setClientUser);
    (userCommands as UserCommand[]).forEach(command => command.setClientUser(user));
  }

  public execute(message: Message) {
    const [command, ...params] = message.content.split(' ');

    if (this.triggers.has(command)) {
      // eslint-disable-next-line no-param-reassign
      console.log(`if (this.triggers.has(command))`)
      message.content = message.content.substring(command.length + 1);

      this.triggers.get(command)!.run(message, params);
      console.log(`Received a message`);
      if (this.config.deleteMessages){
        message.delete();
      }
      return;
    }

    this.soundCommand.run(message);
    console.log(`ran sound command`)
  }

  private registerTriggers(command: Command) {
    command.TRIGGERS.forEach(trigger => this.triggers.set(trigger, command));
  }
}
