import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import onAutocomplete from "./handlers/onAutocomplete.js";
import onButtonInteraction from "./handlers/onButtonInteraction.js";
import onSlashCommand from "./handlers/onSlashCommand.js";
import SessionManager from "./SessionManager.js";
import setAllCommands from "./utils/setAllCommands.js";

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Set the client in SessionManager - TODO: Make this better.
SessionManager.setClient(client);

// Set all commands on the client from files in /commands
setAllCommands(client);

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) onSlashCommand(interaction);
  else if (interaction.isButton()) onButtonInteraction(interaction);
  else if (interaction.isAutocomplete()) onAutocomplete(interaction);
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);
