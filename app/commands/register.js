import { SlashCommandBuilder } from "discord.js";
import { serviceFetch } from "../utils/serviceFetch.js";
import registeredGameAutocomplete from "./common/registeredGameAutocomplete.js";

export const register = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Get notified when a game starts")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the game")
        .setMaxLength(30)
        .setRequired(true)
        .setAutocomplete(true)
    ),
  autocomplete: registeredGameAutocomplete,
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
        await interaction.reply({
          content: `You've been registered to the ${game.game_name} role! You will now receive notifications when this game starts.`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content:
            "Please select from the populated games when using this command. To add a new game, use the `/add` command.",
          ephemeral: true,
        });
      }
    } catch (e) {
      interaction.reply("Something broke. Great job.");
    }
  },
};
