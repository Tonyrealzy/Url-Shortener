import { PrismaClient } from "@prisma/client";
import { envConfig } from "../utilities/config";

declare global {
  namespace NodeJS {
    interface Global {}
  }
}

interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const db = global.prisma || new PrismaClient();

if (envConfig.environment === "development") {
  global.prisma = db;
}

export default db;
