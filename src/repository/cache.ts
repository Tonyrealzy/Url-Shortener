import { Redis } from "@upstash/redis";
import { envConfig } from "../utilities/config";

export const redisCache = new Redis({
  url: envConfig.redisUrl,
  token: envConfig.redisToken,
});
