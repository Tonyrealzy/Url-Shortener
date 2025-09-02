import { Router, Request, Response, NextFunction } from "express";
import { redisCache } from "../repository/cache";
import db from "../repository/db";
import logger from "../utilities/logger";

const router = Router();

/**
 * @openapi
 * /redirect:
 *   get:
 *     summary: Redirect to original long URL
 *     tags:
 *       - Redirect
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *           example: "gik6GHG"
 *         description: The short code of the URL
 *     responses:
 *       302:
 *         description: Redirects to the long URL
 *         headers:
 *           Location:
 *             description: The destination URL
 *             schema:
 *               type: string
 *               example: "https://github.com/Tonyrealzy/Robo-Advisor-React-Frontend"
 *       400:
 *         description: Code query parameter missing
 *       404:
 *         description: Code not found
 */

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      logger.error("Missing code");
      return res.status(400).json({
        status: "error",
        message: "Missing code",
      });
    }

    // add a check for the code in the cache
    const cachedUrl = await redisCache.get<string>(`short:${code}`);
    if (cachedUrl) {
      return res.redirect(cachedUrl);
    }

    // fetch link from database and redirect...
    const link = await db.shortLink.findUnique({
      where: { code },
    });

    if (!link) {
      logger.error("Link not found");
      return res.status(404).json({
        status: "error",
        message: "Link not found",
      });
    } else {
      await redisCache.set(`short:${code}`, link.longUrl);
      logger.info("Link to redirect: ", link.longUrl);
      return res.redirect(link.longUrl);
    }
  } catch (error) {
    logger.error("Error caught: ", error);
    next(error);
  }
});

export default router;
