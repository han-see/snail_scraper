import { MessageEmbed, WebhookClient } from 'discord.js';
import 'dotenv/config';

/**
 * This class is use to send a message to the user discord
 */
export class Webhook {
  private embed: MessageEmbed;
  private userWebhookClient = new WebhookClient({
    url: process.env.USER_DISCORD_WEBHOOK,
  });

  constructor(
    private title: string,
    private content: string,
    private snailLink: string,
    private thumbnail: string,
  ) {
    this.embed = new MessageEmbed()
      .setTitle(this.title)
      .setDescription(this.content)
      .setURL(this.snailLink)
      .setThumbnail(this.thumbnail)
      .setTimestamp();
  }

  sendMessageToUser(nextSnailPrice: number) {
    this.embed.footer = {
      text: `Next Snail's price in Category: ${nextSnailPrice} AVAX`,
    };
    this.userWebhookClient
      .send({
        content: `<@${process.env.DISCORD_USER_ID}>\n${this.embed.title}`,
        embeds: [this.embed],
      })
      .catch((err) => {
        console.error('Cannot send message to discord', err);
      });
  }
}
