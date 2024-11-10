import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const setAllCommands = async (client) => {
  client.commands = new Collection();

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const __grandparentDirname = dirname(__dirname);
  const commandsPath = join(__grandparentDirname, "commands");
  const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith(".js")
  );

  for (const file of commandFiles) {
    const filePath = pathToFileURL(join(commandsPath, file)).toString();
    const key = file.split(".")[0];
    const { [key]: command } = await import(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
};

export default setAllCommands;
