import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export const db = {
  getUsers: () => {
    try {
      if (!fs.existsSync(USERS_FILE)) return [];
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch { return []; }
  },
  saveUser: (user) => {
    const users = db.getUsers();
    users.push(user);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  },
  deleteUser: (username) => {
    const users = db.getUsers().filter(u => u.username !== username);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return users.length; // Return new length to check if deleted
  }
};