import logger from "../utilities/logger";
import db from "./db";

const dbConnection = () => {
  try {
    db.$connect();
    logger.info("✅ Database connected.");
  } catch (error) {
    logger.error("❌ Failed to connect to database: ", error);
    process.exit(1);
  }
};

export default dbConnection;
