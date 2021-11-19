require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const auth = require('./middlewares/auth');

const { PORT = 3001, MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.use(cookieParser());
app.use(express.json());
app.use(auth);
app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
