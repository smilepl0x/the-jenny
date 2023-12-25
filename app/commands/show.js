import { SlashCommandBuilder, Options } from "discord.js";
import fetch from "node-fetch";
import { load } from "cheerio";
// const wait = require("node:timers/promises").setTimeout;

const url = "https://overwatch.blizzard.com/en-us/career/";
const privateProfileClass = ".Profile-private---msg";
const statsContainerClass =
  ".controller-view.Profile-view .stats-container.option-0 .category:nth-child(3) .content";

export const show = {
  data: new SlashCommandBuilder()
    .setName("show")
    .setDescription("Shows a user's stats")
    .addStringOption((option) =>
      option
        .setName("user")
        .setDescription("The BattleTag of the user you want to see")
        .setMaxLength(30)
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      // Reply while we are loading stuff
      await interaction.deferReply();

      // Validation
      const userString = interaction.options.getString("user");
      if (!/[A-Z0-9]{1,20}#[0-9]{1,10}/i.test(userString)) {
        await interaction.editReply("Invalid BattleTag format.");
        return;
      }

      // Do the scraping
      const fullUser = userString.split("#");
      const [username, id] = fullUser;
      const response = await fetch(`${url}${username}-${id}`);
      const body = await response.text();
      const $ = load(body);

      // In cases of private profiles
      if ($(privateProfileClass).text()) {
        await interaction.editReply("This profile is marked as private.");
        return;
      } else if ($(statsContainerClass).html()) {
        const reply = [`Console stats for ${userString}\n\n`];
        $(".stat-item p", statsContainerClass).each((i, el) => {
          if (i % 2 === 0) {
            reply.push(`\`\`\`${$(el).text()}:`);
          } else {
            reply.push(` ${$(el).text()}\`\`\`\n`);
          }
        });
        await interaction.editReply(reply.join(""));
        return;
      }
      //err
      throw new Error("Couldn't find the correct classes");
    } catch (e) {
      console.log(e);
      await interaction.editReply("Something broke. Great job.");
    }
  },
};
