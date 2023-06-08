const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const logger = require('winston');
const helmet = require('helmet');
const sqlite3 = require('sqlite3').verbose();

app.use(express.json());
app.use(helmet());

// Підключення бази даних SQLite
const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (error) => {
  if (error) {
    console.error('Помилка підключення до бази даних:', error.message);
  } else {
    console.log('Підключено до бази даних SQLite');
  }
});

// Оголошення схеми таблиці користувачів
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

// Оголошення схеми таблиці файлів
db.run(`
  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )
`);

app.use(helmet());

app.get('/user', (req, res) => {
  const timestamp = new Date().getTime(); // Значення поточного часу
  db.get(`SELECT * FROM users LIMIT 1?timestamp=${timestamp}`, (error, row) => {
    if (error) {
      console.error('Помилка отримання даних користувача:', error.message);
      res.status(500).json({ error: 'Помилка отримання даних користувача' });
    } else {
      const userData = {
        name: row ? row.name : 'John Doe',
        email: row ? row.email : 'johndoe@example.com',
      };
      res.json(userData);
      res.setHeader('Cache-Control', 'no-cache'); // Вимкнути кешування
      res.json(userData);
    }
  });
});

app.get('/files', (req, res) => {
  const cache = Math.random(); // Випадкове значення
  db.all(`SELECT * FROM files?cache=${cache}`, (error, rows) => {
    if (error) {
      console.error('Помилка отримання файлів користувача:', error.message);
      res.status(500).json({ error: 'Помилка отримання файлів користувача' });
    } else {
      const filesData = rows.map((row) => ({
        id: row.id,
        name: row.name,
      }));
      res.json(filesData);
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Включити кешування на 1 годину
      res.json(filesData);
    }
  });
});

app.listen(4000, () => {
  console.log('Сервер запущено на порту 4000');
});

logger.add(new logger.transports.Console());
logger.add(new logger.transports.File({ filename: 'application.log' }));
logger.log('info', 'Запуск застосунку');

const password = 'secretPassword';
const hashedPassword = bcrypt.hashSync(password, 10);

app.get('/', (req, res) => {
  res.send('Привіт! Застосунок працює.');
});
