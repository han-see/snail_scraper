import { MessageEmbed, WebhookClient } from 'discord.js';
import 'dotenv/config';

export class Webhook {
  embed: MessageEmbed;
  webhookClient = new WebhookClient({ url: process.env.DISCORD_WEBBOOK });

  constructor(
    private title: string,
    private content: string,
    private snailLink: string,
    private thumbnail: string,
  ) {
    this.embed = new MessageEmbed()
      .setTitle(this.title)
      .setColor('#3D9140')
      .setDescription(this.content)
      .setURL(this.snailLink)
      .setThumbnail(this.thumbnail);
  }

  sendMessage() {
    this.webhookClient.send({
      content: `<@${process.env.DISCORD_USER_ID}>\n${this.embed.title}`,
      embeds: [this.embed],
    });
  }
}