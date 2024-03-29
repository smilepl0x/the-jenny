import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = readdirSync("../commands").filter((file) =>
  file.endsWith(".js")
);

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = await import(`../commands/${file}`);
  const key = file.split(".")[0];
  commands.push(command[key].data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );

    // Uncomment this to remove guild
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
