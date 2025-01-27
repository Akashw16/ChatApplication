class UserManager {
    constructor() {
        this.users = new Set();
    }

    addUser(username) {
        this.users.add(username);
    }

    removeUser(username) {
        this.users.delete(username);
    }

    isUsernameTaken(username) {
        return this.users.has(username);
    }
}

module.exports = UserManager;