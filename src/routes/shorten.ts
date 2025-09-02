import { Router, Request, Response, NextFunction } from "express";
import { generateCode } from "../utilities/keygen";
import db from "../repository/db";
import { redisCache } from "../repository/cache";
import logger from "../utilities/logger";

const router = Router();

/**
 * @openapi
 * /shorten:
 *   post:
 *     summary: Shorten a long URL
 *     tags:
 *       - Shorten
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               link:
 *                 type: string
 *                 example: "https://github.com/Tonyrealzy/Robo-Advisor-React-Frontend"
 *     responses:
 *       200:
 *         description: Successfully shortened
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Link shortened successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     shortUrl:
 *                       type: string
 *                       example: "https://url-shortener-service-7vhn.onrender.com/redirect?code=gik6GHG"
 *                     longUrl:
 *                       type: string
 *                       example: "https://github.com/Tonyrealzy/Robo-Advisor-React-Frontend"
 *       400:
 *         description: Link is required
 *       500:
 *         description: Something went wrong
 */

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { link } = req.body;
    if (!link) {
      logger.error("Link is required");
      return res.status(400).json({
        status: "error",
        message: "Link is required",
      });
    }

    let code = generateCode();
    let finalLink: any;

    for (let i = 0; i < 3; i++) {
      try {
        logger.info("Code persisted: ", code);
        finalLink = await db.shortLink.create({
          data: { code: code, longUrl: link },
        });
        break;
      } catch (error: any) {
        if (error.code === "P2002") {
          finalLink = generateCode();
        } else {
          logger.error("Something went wrong: ", error);
          return res
            .status(500)
            .json({ status: "error", message: "Something went wrong" });
        }
      }
    }

    if (!finalLink) {
      logger.error("Failed to generate unique code");
      return res
        .status(500)
        .json({ status: "error", message: "Failed to generate unique code" });
    } else {
      await redisCache.set(`short:${finalLink?.code}`, finalLink?.longUrl);
      const shortUrl = `${req.protocol}://${req.get("host")}/redirect?code=${
        finalLink?.code
      }`;

      logger.info("Shortened link: ", shortUrl);
      res.status(200).json({
        status: "success",
        message: "Link shortened successfully",
        data: {
          shortUrl,
          longUrl: link,
        },
      });
    }
  } catch (error) {
    logger.error("Error caught: ", error);
    next(error);
  }
});

export default router;
