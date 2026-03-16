import { serviceFetch } from "../utils/serviceFetch.js";
import sessionMessageBuilder from "../utils/sessionMessageBuilder.js";

const onMessage = async (m) => {
  try {
    const { status, sessions } = await serviceFetch({
      path: `/sessions/${m.channelId}`
    })
    if (status === 1) return;
    sessions.forEach(async (s) => {
      const msg = await m.channel.messages.fetch(s.message_id);
      // Delete original message
      msg.delete()
      // Send new message
      const [original, _] = msg.content.split("\n");
      const newMessage = await m.channel.send(sessionMessageBuilder(original, s.party_members, s.max_party_size));
      // Update message_id on server
      await serviceFetch({ method: "PATCH", path: `/session/${s.message_id}`, body: { messageId: newMessage.id } })
    });
  } catch (error) {
    console.log("error", error);
  }
}

export default onMessage;
