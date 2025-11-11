// db.js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const DB_PATH = path.join(__dirname, 'database.sqlite');

let db; // cached db instance

async function initDB() {
  if (db) return db;
  db = await open({ filename: DB_PATH, driver: sqlite3.Database });

  // Create tables (id, filename, original_name, uploaded_at)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS displays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      assigned_video_id INTEGER,
      FOREIGN KEY (assigned_video_id) REFERENCES videos(id)
    );
  `);

  return db;
}

module.exports = { initDB };
