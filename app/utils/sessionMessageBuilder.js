import startSessionStringBuilder from "./startSessionStringBuilder.js";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle } from "discord.js";
import { SESSION_MESSAGE_CONSTS } from "../constants/sessionMessageConstants.js";

const sessionMessageBuilder = (original, partyMembers, maxPartySize,) => ({
  content: startSessionStringBuilder({
    original,
    numParty: partyMembers?.length,
    maxParty: maxPartySize,
    party: partyMembers,
  }),
  components: [buttonsBuilder(maxPartySize ? partyMembers?.length >= maxPartySize : false)]
});

const buttonsBuilder = (partyFull) => new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId(SESSION_MESSAGE_CONSTS.DROP_IN_BTN_ID)
    .setLabel(partyFull ? "Party full" : "Drop in")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(partyFull),
  new ButtonBuilder()
    .setCustomId(SESSION_MESSAGE_CONSTS.DROP_OUT_BTN_ID)
    .setLabel("Drop out")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId(SESSION_MESSAGE_CONSTS.IN_A_BIT_BTN_ID)
    .setLabel("In a bit")
    .setStyle(ButtonStyle.Secondary)
);

export default sessionMessageBuilder;
