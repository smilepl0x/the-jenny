import { v4 as uuidv4 } from "uuid";
import config from "./config.json";

class Session {
  constructor(id, maxParty, user, channel) {
    this.id = uuidv4();
    this.startTime = Date.now();
    this.channel = channel;
    this.messageId = id;
    this.maxParty = maxParty || undefined;
    this.party = [user];
    this.numParty = this.party.length;
  }

  addPartyMember = (user) => {
    this.party.push(user);
  };

  removePartyMember = (user) => {
    const index = this.party.indexOf(user);
    this.party.splice(index, 1);
  };

  findPartyMember = (user) => {
    return this.party.find((partyMember) => partyMember === user);
  };
}

let manager;
class SessionManager {
  #sessions;
  constructor() {
    if (manager) {
      console.log("Instance already created");
      return;
    }
    manager = this;
    this.#sessions = [];
    this.client = null;

    // Watcher - Clears sessions after timeoout
    setInterval(() => {
      this.#sessions.forEach(async (session) => {
        if (
          Date.now() - session.startTime > config.sessionTimeout &&
          this.client
        ) {
          console.log(`Attempting to remove session ${session}`);
          this.removeSession(session);
          // Edit the message
          const channel = await this.client.channels.fetch(session.channel);
          const message = await channel.messages.fetch(`${session.messageId}`);
          message.edit({ content: "Session ended", components: [] });
        }
      });
    }, config.sessionTimeout / 10);
  }

  setClient(client) {
    this.client = client;
  }

  addSession(id, maxParty, user, channel) {
    this.#sessions.push(new Session(id, maxParty, user, channel));
  }

  removeSession(ref) {
    const session = this.#sessions.indexOf(ref);
    this.#sessions.splice(session, 1);
  }

  findSession(id) {
    return this.#sessions.find((session) => session.messageId === id);
  }
}

export default new SessionManager(); // Object.freeze
