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
  Partials,
} from "discord.js";
import SessionManager from "./SessionManager.js";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { startSessionStringBuilder } from "./utils.js";
import { serviceFetch } from "./utils/serviceFetch.js";

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
client.once(Events.ClientReady, async (c) => {
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
  try {
    const nickname = interaction.member.nickname || interaction.user.globalName;
    const { party_members, max_party_size } = await serviceFetch({
      path: `/session/${interaction.message.id}`,
    });
    let partyMembers = party_members;
    let maxPartySize = max_party_size;
    let partyFull = false;

    if (
      interaction.customId === "drop-in" ||
      interaction.customId === "drop-out"
    ) {
      const path = interaction.customId === "drop-in" ? "join" : "leave";
      const { party_members, max_party_size } = await serviceFetch({
        method: "PATCH",
        path: `/session/${path}`,
        body: {
          partyMember: nickname,
          messageId: interaction.message.id,
        },
      });
      partyMembers = party_members;
      maxPartySize = max_party_size;
      partyFull = maxPartySize ? partyMembers?.length >= maxPartySize : false;
    } else if (interaction.customId === "in-a-bit") {
      interaction.channel.send(
        `${interaction.member.nickname} will join soon!`
      );
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
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("in-a-bit")
        .setLabel("In a bit")
        .setStyle(ButtonStyle.Secondary)
    );

    const [original, _] = interaction.message.content.split("\n");
    let interactionObj;
    if (partyMembers?.length > 0 || interaction.customId === "in-a-bit") {
      interactionObj = {
        content: startSessionStringBuilder({
          original,
          numParty: partyMembers?.length,
          maxParty: maxPartySize,
          party: partyMembers,
        }),
        components: [buttons],
      };
    } else {
      interactionObj = {
        content: "Session ended",
        components: [],
      };
      await serviceFetch({
        path: `/session/${interaction.message.id}`,
        method: "DELETE",
      });
    }
    interaction.update(interactionObj);
  } catch (e) {
    console.log(e);
    interaction.reply("Ya fucked up, Jimbo.");
  }
});

// Autocompletes
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isAutocomplete()) return;
  try {
    const command = interaction.client.commands.get(interaction.commandName);
    command.autocomplete(interaction);
  } catch (e) {
    console.error(e);
  }
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);
