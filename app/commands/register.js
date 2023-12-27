import { SlashCommandBuilder } from "discord.js";

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
      const game = interaction.options.getString("name");
      const emoji = interaction.options.getString("emoji");
      const partySize = interaction.options.getInteger("size");
      const aliases =
        interaction.options.getString("aliases")?.split(",") || [];

      // Ensure the game doesn't already exist
      const findGameUrl = "http://backend:3000/game/";
      const { game_name } = await (await fetch(`${findGameUrl}${game}`)).json();
      if (game_name) {
        return interaction.reply({
          content: `${game_name} already exists`,
        });
      }

      // Ensure the alias doesnt already exist
      for (const alias of aliases) {
        const { game_name } = await (
          await fetch(`${findGameUrl}${alias}`)
        ).json();
        if (game_name) {
          return interaction.reply({
            content: `The alias ${alias} already exists for the game ${game_name}`,
          });
        }
      }

      // Ensure the emoji is... an emoji
      if (/\P{Emoji}/u.test(emoji)) {
        return interaction.reply({
          content: "Your emoji doesn't look right. Try again.",
        });
      }

      // Ensure the emoji doesn't already exist on another game.
      const { game_name: emoji_game_name } = await (
        await fetch(`${findGameUrl}${emoji}`)
      ).json();
      if (emoji_game_name) {
        return interaction.reply({
          content: `The game ${emoji_game_name} already exists with registration emoji ${emoji}`,
        });
      }

      // Phew, i think we made it. Create the role.
      const generateRandomHexArray = () => {
        // TODO: Move this elsewhere.
        const getHex = () => Math.random() * (255 - 0);
        return [getHex(), getHex(), getHex()];
      };
      const role = await interaction.guild.roles.create({
        name: game,
        color: generateRandomHexArray(),
      });

      // Add the role to the database
      await fetch(`http://backend:3000/game/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleId: role.id,
          gameName: game,
          maxPartySize: partySize,
          registrationEmoji: emoji,
          aliases,
        }),
      });

      // Add the role to the user.
      await interaction.member.roles.add(role);

      // Add the message to the text channel or update it.

      return interaction.reply({ content: emoji });
    } catch (e) {
      console.log(e);
      await interaction.editReply("Something broke. Great job.");
    }
  },
};
