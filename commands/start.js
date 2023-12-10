import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { SlashCommandBuilder, ButtonStyle } from "discord.js";
import config from "../config.json";
import SessionManager from "../SessionManager.js";
import { startSessionStringBuilder } from "../utils.js";

export const start = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start a new game session")
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("The name of the game")
        .setMaxLength(25)
        .setRequired(true)
    ),
  async execute(interaction) {
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("drop-in")
        .setLabel("Drop in")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("drop-out")
        .setLabel("Drop out")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("in-a-bit")
        .setLabel("In a little bit")
        .setStyle(ButtonStyle.Secondary)
    );
    try {
      // Check config for any roles/party sizes that might be available
      let role;
      let maxParty;
      for (let game of config.games) {
        if (
          game.labels.includes(
            interaction.options.getString("game").toLowerCase()
          )
        ) {
          role = game.roleId;
          maxParty = game.maxParty;
        }
      }

      await interaction.reply({
        content: startSessionStringBuilder({
          user: interaction.user,
          role,
          game: interaction.options.getString("game"),
          maxParty,
        }),
        components: [buttons],
      });

      const reply = await interaction.fetchReply();
      SessionManager.addSession(
        reply.id,
        maxParty,
        interaction.user,
        interaction.channel.id
      );
    } catch (e) {
      console.log(e);
      interaction.reply("Something broke. Great job.");
    }
  },
};
