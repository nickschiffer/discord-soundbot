import { Message } from 'discord.js';

import localize from '@util/i18n/localize';

const getVoiceChannelFromAuthor = (message: Message) => {
  const { voiceChannel } = message.member;
  if (!voiceChannel) {
    message.author.send(localize.t('helpers.voiceChannelFinder.error'));
  }

  return voiceChannel;
};

export default getVoiceChannelFromAuthor;
