import { serviceFetch } from "./serviceFetch.js";

const createRegistrationAnnouncement = (games) => {
  return `
 ---GAME NOTIFICATIONS---\n\nReact with the corresponding emoji to be notified when a game starts!
 \`\`\`${Object.values(games)
   .map((game) =>
     typeof game === "object"
       ? `${game.game_name} ${game.registration_emoji}`
       : ""
   )
   .join("\n")}\`\`\`
 `;
};

const fetchAnnouncementChannelAndMessage = async (client) => {
  const announcementChannel = await client.channels.fetch(
    process.env.GAME_ANNOUNCEMENT_CHANNEL_ID
  );
  const messages = await announcementChannel.messages.fetch();
  const botMessage = messages.filter(
    (message) => message.author.id === process.env.CLIENT_ID
  );
  const announcementMessage =
    botMessage.size > 0 ? botMessage.values().next().value : null;
  return { announcementChannel, announcementMessage };
};

export const announceGameList = async (client) => {
  try {
    const games = await serviceFetch({ path: "/games" });
    if (Object.values(games).length > 0) {
      const announcement = createRegistrationAnnouncement(games);
      const { announcementChannel, announcementMessage } =
        await fetchAnnouncementChannelAndMessage(client);
      if (announcementMessage) {
        await announcementMessage.edit(announcement);
      } else {
        await announcementChannel.send(announcement);
      }
    }
  } catch (e) {
    throw e;
  }
};
