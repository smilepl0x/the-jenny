import { REST, Routes } from "discord.js";

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`Started removing guild (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: [] }
    );

    console.log(`Successfully removed guild (/) commands.`);

    // Uncomment this to remove guild
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
