import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
// Require the necessary discord.js classes
import {
  ButtonStyle,
  Client,
  Collection,
  Events,
  GatewayIntentBits,
} from "discord.js";
import config from "./config.json" assert { type: "json" };
import SessionManager from "./SessionManager.js";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { startSessionStringBuilder } from "./utils.js";

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// Set the client in SessionManager - TODO: Make this better.
SessionManager.setClient(client);

client.commands = new Collection();

const __dirname = dirname(fileURLToPath(import.meta.url));
const commandsPath = join(__dirname, "commands");
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

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Slash commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// Buttons
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  const theSession = SessionManager.findSession(interaction.message.id);

  try {
    // Shouldn't happen, but jic
    if (!theSession) {
      interaction.message.delete();
      throw new Error("No session was found.");
    }

    const partyFull = theSession.numParty >= theSession.maxParty;
    const alreadyIn = theSession.party.includes(interaction.user);

    if (interaction.customId === "drop-in") {
      if ((!partyFull || !theSession.maxParty) && !alreadyIn) {
        theSession.numParty++;
        theSession.addPartyMember(interaction.user);
      }
    } else if (interaction.customId === "drop-out") {
      if (theSession.numParty > 0 && alreadyIn) {
        theSession.numParty--;
        theSession.removePartyMember(interaction.user);
      }
    }

    // Update button states
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("drop-in")
        .setLabel(partyFull ? "Party full" : "Drop in")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(partyFull),
      new ButtonBuilder()
        .setCustomId("drop-out")
        .setLabel("Drop out")
        .setStyle(ButtonStyle.Secondary)
    );

    const [original, _] = interaction.message.content.split("\n");
    let interactionObj;
    if (theSession.numParty > 0) {
      interactionObj = {
        content: startSessionStringBuilder({
          original,
          numParty: theSession.numParty,
          maxParty: theSession.maxParty,
          party: theSession.party,
        }),
        components: [buttons],
      };
    } else {
      interactionObj = {
        content: "Session ended",
        components: [],
      };
      SessionManager.removeSession(theSession);
    }
    interaction.update(interactionObj);
  } catch (e) {
    console.log(e);
    interaction.reply("Ya fucked up, Jimbo.");
  }
});

// Log in to Discord with your client's token
client.login(config.token);
