import { v4 as uuidv4 } from "uuid";

let manager;

export class Session {
  constructor(id, maxParty, user) {
    this.id = uuidv4();
    this.startTime = Date.now();
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

class SessionManager {
  #sessions = [];

  constructor() {
    if (manager) {
      console.log("Instance already created");
      return;
    }
    manager = this;
  }

  get sessions() {
    return this.#sessions;
  }

  addSession(id, maxParty, user) {
    this.#sessions.push(new Session(id, maxParty, user));
  }

  removeSession(ref) {
    const session = this.#sessions.indexOf(ref);
    this.#sessions.splice(session, 1);
  }

  findSession(id) {
    return this.#sessions.find((session) => session.messageId === id);
  }
}

export default Object.freeze(new SessionManager());
