import { serviceFetch } from "../utils/serviceFetch.js";
import sessionMessageBuilder from "../utils/sessionMessageBuilder.js";
import { SESSION_MESSAGE_CONSTS } from "../constants/sessionMessageConstants.js";

const onButtonInteraction = async (interaction) => {
  try {
    const nickname = interaction.member.nickname || interaction.user.globalName;
    const { party_members, max_party_size } = await serviceFetch({
      path: `/session/${interaction.message.id}`,
    });
    let partyMembers = party_members;
    let maxPartySize = max_party_size;
    let partyFull = false;

    if (
      interaction.customId === SESSION_MESSAGE_CONSTS.DROP_IN_BTN_ID ||
      interaction.customId === SESSION_MESSAGE_CONSTS.DROP_OUT_BTN_ID
    ) {
      const path =
        interaction.customId === SESSION_MESSAGE_CONSTS.DROP_IN_BTN_ID
          ? "join"
          : "leave";
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
    } else if (
      interaction.customId === SESSION_MESSAGE_CONSTS.IN_A_BIT_BTN_ID
    ) {
      interaction.channel.send(`${nickname} will join soon!`);
    }

    const [original, _] = interaction.message.content.split("\n");
    let interactionObj;
    if (
      partyMembers?.length > 0 ||
      interaction.customId === SESSION_MESSAGE_CONSTS.IN_A_BIT_BTN_ID
    ) {
      interactionObj = sessionMessageBuilder(original, partyMembers, maxPartySize)
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
};

export default onButtonInteraction;
