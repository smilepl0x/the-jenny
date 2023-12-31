import { SlashCommandBuilder } from "discord.js";
import { announceGameList } from "../utils/announceGameList.js";
import { serviceFetch } from "../utils/serviceFetch.js";
import { generateRandomHexArray } from "../utils/generateRandomHexArray.js";

// Dear god refactor all of this
export const register = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register a new game")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the new game you want to add.")
        .setMaxLength(30)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("emoji")
        .setDescription("An emoji used to self-register for this game.")
        .setMaxLength(20)
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
      const registrationEmoji = interaction.options.getString("emoji");
      const partySize = interaction.options.getInteger("size");
      const aliases =
        interaction.options.getString("aliases")?.split(",") || [];

      // Ensure the emoji is... an emoji
      if (/\P{Emoji}/u.test(registrationEmoji)) {
        return interaction.reply({
          content: "Your emoji doesn't look right. Try again.",
        });
      }

      // Ensure the game name, emoji, or alias doesn't exist already
      try {
        const { games, status } = await serviceFetch({
          path: "/game",
          method: "POST",
          body: { gameName, registrationEmoji, aliases },
        });
        if (status !== 0) throw new Error("Unable to search for game");
        if (games?.length) {
          let errors = [];
          games.forEach((game) => {
            if (game.game_name === gameName) {
              errors.push(`${gameName} is already registered.`);
            }
            if (game.registration_emoji === registrationEmoji) {
              errors.push(
                `${registrationEmoji} is already registered to ${game.game_name}`
              );
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
            registrationEmoji,
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
        `${gameName} was registered with emoji ${registrationEmoji} ${
          aliases.length ? `and aliases ${aliases}` : ""
        }`
      );
    } catch (e) {
      console.log(e);
      await interaction.reply("Something broke. Great job.");
    }
  },
};
