import { SlashCommandBuilder } from "discord.js";
import { serviceFetch } from "../utils/serviceFetch.js";
import registeredGameAutocomplete from "./common/registeredGameAutocomplete.js";

export const poll = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Poll interest in a game")
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("The game you want to poll for interest.")
        .setMaxLength(30)
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("The time or place you want to poll for.")
        .setMaxLength(30)
    ),
  autocomplete: registeredGameAutocomplete,
  async execute(interaction) {
    try {
      const gameName = interaction.options.getString("game");
      const time = interaction.options.getString("time");

      // Check if role is associated with this game
      const { games } = await serviceFetch({ path: "/games" });
      const game = games.find((game) => game.game_name === gameName);

      // Set up strings for the poll
      const questionText = `${gameName}${!!time ? ` @ ${time}` : ""}`;
      const answers = [{ text: "Yes" }, { text: "No" }];
      if (!!time) answers.push({ text: "Earlier" }, { text: "Later" });
      const content = !!game ? `<@&${game.role_id}>` : "";

      const reply = await interaction.reply({
        content: content,
        poll: {
          question: { text: questionText },
          answers: answers,
          duration: 1,
          allowMultiselect: false,
        },
        fetchReply: true,
      });

      // console.log("POLL reply:\n", reply);
      // TODO: Add poll to db and create button to close poll and start session
    } catch (e) {
      console.error(e);
      await interaction.reply("Something broke. Great job.");
    }
  },
};
