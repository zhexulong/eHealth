// import { AGORA_APP_ID, AGORA_CHANNEL_NAME, AGORA_TOKEN } from 'process.env';

export const AGORA_CONFIG = {
  appId: process.env.AGORA_APP_ID,
  channelName: process.env.AGORA_CHANNEL_NAME,
  token: process.env.AGORA_TOKEN || null,
};
