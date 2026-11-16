require('dotenv').config();

const useMysql = Boolean(process.env.MYSQLHOST || process.env.DB_HOST);

if (useMysql) {
  const mysql = require('mysql2');
  const pool = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME,
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  });
  const promisePool = pool.promise();
  promisePool.dialect = 'mysql';
  module.exports = promisePool;
} else {
  const { createStore } = require('./sqlite');

  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_id INTEGER,
      action TEXT,
      target_user_id INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const store = createStore({ name: 'bastion', schema });

  async function seed() {
    const [rows] = await store.query('SELECT COUNT(*) AS c FROM users');
    if (Number(rows[0].c) > 0) return;
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('Demo#2026', 10);
    await store.query(
      'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      ['Light', 'light@bastion.app', hash, 'superadmin', 'active']
    );
    await store.query(
      'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      ['Amina', 'amina@bastion.app', hash, 'user', 'active']
    );
  }

  const ready = store.open().then(seed);
  const query = async (sql, params) => {
    await ready;
    return store.query(sql, params);
  };

  module.exports = { query, dialect: 'sqlite' };
}
