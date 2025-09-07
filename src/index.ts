import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { envConfig } from "./utilities/config";
import { errorHandler } from "./middleware/errorHandler";
import { corsOptions } from "./middleware/corsOptions";
import { limiter } from "./middleware/rateLimiting";
import logger from "./utilities/logger";
import shortenRouter from "./routes/shorten";
import redirectRouter from "./routes/redirect";
import healthRouter from "./routes/health";
import dbConnection from "./repository/connection";
import { setupSwagger } from "./static/swagger";
import { cronJob } from "./utilities/cronJob";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

dbConnection();
cronJob();

setupSwagger(app);

app.use("/shorten", shortenRouter);
app.use("/redirect", redirectRouter);
app.use("/health", healthRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

app.use(errorHandler);

app.listen(envConfig.port, () => {
  logger.info(
    `Server is running on port ${envConfig.port} in ${envConfig.environment} mode!`
  );
});
