const config = {
  PORT: process.env.PORT || 5000,
  DB_URI: process.env.DB_URI || 'mysql://user:password@localhost:3306/library_management',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

module.exports = config;