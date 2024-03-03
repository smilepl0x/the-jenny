import { SlashCommandBuilder } from "discord.js";
import { serviceFetch } from "../utils/serviceFetch.js";

export const register = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Get notified when a game starts")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name or alias of the game")
        .setMaxLength(30)
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    // TODO: may need to keep local cache for this at some point
    const { games } = await serviceFetch({ path: "/games" });
    const value = interaction.options.getFocused().toLowerCase();
    const filteredGames = games.filter(
      (game) =>
        game.game_name.toLowerCase().includes(value) ||
        game.aliases.some((alias) => alias.toLowerCase().includes(value))
    );
    await interaction.respond(
      filteredGames.map((filteredGame) => ({
        name: filteredGame.game_name,
        value: filteredGame.game_name,
      }))
    );
  },
  async execute(interaction) {
    try {
      const value = interaction.options.getString("name");
      // TODO: Call repeated on execute. Another good reason for local cache.
      const { games } = await serviceFetch({ path: "/games" });
      const game = games.find((game) => game.game_name === value);
      if (!!game) {
        const role = await interaction.guild.roles.fetch(game.role_id);
        if (!role)
          throw new Error(`No role ${game.role_id}`, interaction.guild.roles);
        interaction.guild.members.addRole({
          user: interaction.user,
          role: role,
        });
        await interaction.reply("Done.");
      } else {
        await interaction.reply(
          "That game hasn't been added to this channel. To add it, use the `/add` command."
        );
      }
    } catch (e) {
      interaction.reply("Something broke. Great job.");
    }
  },
};
