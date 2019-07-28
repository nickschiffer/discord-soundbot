import { Message, VoiceConnection } from 'discord.js';

import Config from '@config/Config';
import * as sounds from '@util/db/Sounds';
import { getPathForSound } from '@util/SoundUtil';
import QueueItem from './QueueItem';

export default class SoundQueue {
  private readonly config: Config;

  private queue: QueueItem[];
  private currentSound: QueueItem | null;

  constructor(config: Config) {
    this.config = config;
    this.queue = [];
    this.currentSound = null;
  }

  public add(item: QueueItem) {
    this.queue.push(item);
    if (this.isStartable()) this.playNext();
  }

  public clear() {
    if (!this.currentSound) return;
    if (this.config.deleteMessages) this.deleteMessages();

    // Prevent further looping
    this.currentSound.count = 0;
    this.queue = [];
  }

  private isStartable() {
    return this.currentSound === null;
  }

  private deleteMessages() {
    if (this.isEmpty()) return;

    let deleteableMessages = this.queue
      .map(item => item.message)
      .filter(message => message) as Message[];

    if (this.currentSound!.message) {
      deleteableMessages = deleteableMessages
        .filter(message => message.id !== this.currentSound!.message!.id);
    }

    // Do not try to delete the same sound multiple times (!combo)
    Array.from(new Set(deleteableMessages))
      .forEach(message => message.delete());
  }

  private playNext() {
    this.currentSound = this.queue.shift()!;
    const sound = getPathForSound(this.currentSound.name);

    this.currentSound.channel.join()
      .then(connection => this.deafen(connection))
      .then(connection => this.playSound(connection, sound))
      .then(connection => this.onFinishedPlayingSound(connection))
      .catch(error => console.error('Error occured!', '\n', error));
  }

  private deafen(connection: VoiceConnection) {
    // Can only deafen when in a channel, therefore need connection
    if (connection.channel.guild.me.deaf !== this.config.deafen) {
      connection.channel.guild.me.setDeaf(this.config.deafen);
    }

    return Promise.resolve(connection);
  }

  private playSound(connection: VoiceConnection, name: string): Promise<VoiceConnection> {
    console.log(`playing sound`)
    return new Promise(resolve =>
      connection.playFile(name, { volume: this.config.volume })
                .on('end', () => resolve(connection)));
  }

  private onFinishedPlayingSound(connection: VoiceConnection) {
    const { name, channel, message, count } = this.currentSound!;

    sounds.incrementCount(name);
    this.deleteCurrentMessage();

    if (count - 1 > 0) {
      this.add(new QueueItem(name, channel, message, count - 1));
    }

    if (!this.isEmpty()) {
      this.playNext();
      return;
    }

    this.currentSound = null;
    if (!this.config.stayInChannel) connection.disconnect();
  }

  private deleteCurrentMessage() {
    if (!this.config.deleteMessages) return;
    if (!this.currentSound || !this.currentSound.message) return;
    if (!this.isLastSoundFromCurrentMessage(this.currentSound.message)) return;
    if (this.wasMessageAlreadyDeleted(this.currentSound.message)) return;

    this.currentSound.message.delete();
  }

  private isEmpty() {
    return this.queue.length === 0;
  }

  private wasMessageAlreadyDeleted(message: Message) {
    if (!message) return false;

    return message.channel.messages.find(msg => msg.id === message.id) === null;
  }

  private isLastSoundFromCurrentMessage(message: Message) {
    return !this.queue.some(item => !!item.message && item.message.id === message.id);
  }
}