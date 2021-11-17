const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const { PORT = 3001, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
