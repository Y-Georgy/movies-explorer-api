const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://movie.nomoredomains.rocks',
    'https://movie.nomoredomains.rocks',
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
