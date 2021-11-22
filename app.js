require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate'); // для обработки ошибок joi, celebrate
const cors = require('cors'); // пакет node.js
const router = require('./routes/index');
const { limiter } = require('./middlewares/limiter');
const options = require('./utils/cors');
const centralizedErrors = require('./middlewares/centralizedErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();
mongoose.connect(MONGO_URL);

app.use('*', cors(options));
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter); // apply to all requests
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(centralizedErrors); // централизованная обработка ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
