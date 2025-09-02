import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
  port: process.env.PORT || 4000,
  limitTime: process.env.LIMIT_TIME || 1, // 1 minute
  limitRequest: process.env.LIMIT_REQUEST || 50, // limit each IP to 50 requests per windowMs,
  environment: process.env.NODE_ENV || "production",
  postgresUrl: process.env.DATABASE_URL,
  baseUrl: process.env.BASE_URL || "",
  redisUrl: process.env.REDIS_URL,
  redisToken: process.env.REDIS_TOKEN,
};
