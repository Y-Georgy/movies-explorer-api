require('dotenv').config();

const {
  NODE_ENV,
  JWT_SECRET = 'some-secret-key',
  MONGO_URL = 'mongodb://localhost:27017/moviesdb',
  PORT,
} = process.env;

module.exports = {
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
  MONGO_URL: NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/moviesdb',
  PORT: NODE_ENV === 'production' ? PORT : 3001,
};
