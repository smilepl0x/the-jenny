import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { SlashCommandBuilder, ButtonStyle } from "discord.js";
import { startSessionStringBuilder } from "../utils.js";
import { serviceFetch } from "../utils/serviceFetch.js";

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
        .setLabel("In a bit")
        .setStyle(ButtonStyle.Secondary)
    );
    try {
      let game = interaction.options.getString("game").toLowerCase();
      const channelId = interaction.channel.id;
      const nickname =
        interaction.member.nickname || interaction.user.globalName;

      const { games } = await serviceFetch({
        path: "/game",
        method: "POST",
        body: { gameName: game, aliases: [game] },
      });

      const { role_id, game_name, max_party_size } = games?.[0] || {};

      if (game_name) {
        game = game_name;
      }

      await interaction.reply({
        content: startSessionStringBuilder({
          interaction,
          role: role_id,
          game,
          maxParty: max_party_size,
          party: [nickname],
        }),
        components: [buttons],
      });

      const reply = await interaction.fetchReply();
      await serviceFetch({
        path: "/session",
        method: "POST",
        body: {
          channelId,
          messageId: reply.id,
          partyMembers: [nickname],
          gameName: game,
        },
      });
    } catch (e) {
      console.log(e);
      interaction.reply("Something broke. Great job.");
    }
  },
};
