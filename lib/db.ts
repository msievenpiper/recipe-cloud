import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./recipes.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the recipes database.');
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, instructions TEXT, notes TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT)');
});

export default db;
