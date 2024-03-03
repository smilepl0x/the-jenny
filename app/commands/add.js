import { SlashCommandBuilder } from "discord.js";
import { announceGameList } from "../utils/announceGameList.js";
import { serviceFetch } from "../utils/serviceFetch.js";
import { generateRandomHexArray } from "../utils/generateRandomHexArray.js";

// Dear god refactor all of this
export const add = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add a new game")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the new game you want to add.")
        .setMaxLength(30)
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("size")
        .setDescription("The maximum party size for this game.")
    )
    .addStringOption((option) =>
      option
        .setName("aliases")
        .setDescription("A comma separated list of aliases for this game.")
        .setMaxLength(50)
    ),
  async execute(interaction) {
    try {
      const gameName = interaction.options.getString("name");
      const partySize = interaction.options.getInteger("size");
      const aliases =
        interaction.options.getString("aliases")?.split(",") || [];

      // Ensure the game name or alias do not exist already
      try {
        const { games, status } = await serviceFetch({
          path: "/game",
          method: "POST",
          body: { gameName, aliases },
        });
        if (status !== 0) throw new Error("Unable to search for game");
        if (games?.length) {
          let errors = [];
          games.forEach((game) => {
            if (game.game_name === gameName) {
              errors.push(`${gameName} is already registered.`);
            }
            aliases.forEach((alias) => {
              game.aliases.includes(alias)
                ? errors.push(
                    `Alias ${alias} is already registered to ${game.game_name}`
                  )
                : null;
            });
          });
          return interaction.reply(errors.join(" "));
        }
      } catch (e) {
        throw e;
      }

      // Phew, i think we made it. Create the role.
      const role = await interaction.guild.roles.create({
        name: gameName,
        color: generateRandomHexArray(),
      });
      if (!role.id) throw new Error("Unable to create role");

      // // Add the role to the database
      try {
        const { status } = await serviceFetch({
          path: "/game/add",
          method: "POST",
          body: {
            roleId: role.id,
            gameName,
            maxPartySize: partySize,
            aliases,
          },
        });
        if (status !== 0) throw new Error("Failed to add game to db");
      } catch (e) {
        throw e;
      }

      // Add the role to the user.
      await interaction.member.roles.add(role);

      // Send the message to the announcement channel
      await announceGameList(interaction.client);

      return interaction.reply(
        `${gameName} was registered ${
          aliases.length ? `with aliases ${aliases}` : ""
        }`
      );
    } catch (e) {
      // TODO: Rollback logic
      console.error(e);
      await interaction.reply("Something broke. Great job.");
    }
  },
};
