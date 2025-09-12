import { Client, Message } from "discord.js";
import { imageLinks, createImageEmbed } from "./embeds";
import { safeSend } from "../utils";

export function setupImageCommands(client: Client) {
  client.on("messageCreate", async (message: Message) => {
    if (message.author.bot) return;
    await message.delete().catch(() => {});
    const command = message.content.trim().toLowerCase();

    if (command in imageLinks) {
      const embed = createImageEmbed(command);
      if (embed) {
        await safeSend(message.channel, { embeds: [embed] });
      }
    }
  });
}