import { registerAs } from '@nestjs/config';

export const configurationMongo = registerAs('mongo', () => ({
  MONGO_URI: process.env.MONGO_URI,
}));
