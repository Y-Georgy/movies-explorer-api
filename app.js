require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate'); // для обработки ошибок joi, celebrate
const cors = require('cors'); // пакет node.js
const router = require('./routes/index');
const centralizedErrors = require('./middlewares/centralizedErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001, MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

const options = { // TODO убрать в utils?
  origin: [
    'http://localhost:3000',
    // 'http://mesto.tmweb.ru',
    // 'https://mesto.tmweb.ru',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options)); // ПЕРВЫМ!
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger); // подключаем логгер запросов
app.use(router);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(centralizedErrors); // централизованная обработка ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
