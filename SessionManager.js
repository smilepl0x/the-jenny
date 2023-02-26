let manager;

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

  addSession(session) {
    this.#sessions = [...this.#sessions, session];
  }

  removeSession(ref) {
    const session = this.#sessions.indexOf(ref);
    this.#sessions.splice(session, 1);
  }
}

export default Object.freeze(new SessionManager());
