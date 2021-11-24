const corsOptions = {
  origin: [
    'http://localhost:3001',
    // 'http://mesto.tmweb.ru',
    // 'https://mesto.tmweb.ru',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

module.exports = {
  corsOptions,
};
