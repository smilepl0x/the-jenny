import { serviceFetch } from "./utils/serviceFetch.js";

let manager;
class SessionManager {
  #sessions;
  constructor() {
    if (manager) {
      console.log("Instance already created");
      return;
    }
    manager = this;
    this.client = null;

    // Watcher - Polls for expired sessions
    setInterval(async () => {
      const expiredSessions = await this.removeExpiredSessions();
      if (expiredSessions) {
        Object.values(expiredSessions).forEach(async (session) => {
          await this.updateMessage(session);
        });
      }
    }, 60 * 60 * 1000);
  }

  setClient(client) {
    this.client = client;
  }

  async updateMessage(session) {
    // Edit the message
    if (session.channel_id && session.message_id) {
      const channel = await this.client.channels.fetch(session.channel_id);
      const message = await channel.messages.fetch(`${session.message_id}`);
      message.edit({ content: "Session ended", components: [] });
    }
  }

  async removeExpiredSessions() {
    return await serviceFetch({
      path: `/sessions?sl=${process.env.SESSION_LENGTH}`,
      method: "PATCH",
      body: {},
    });
  }
}

export default new SessionManager(); // Object.freeze
