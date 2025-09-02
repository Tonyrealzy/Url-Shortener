import { Router, Request, Response, NextFunction } from "express";
import { generateCode } from "../utilities/keygen";
import db from "../repository/db";
import { redisCache } from "../repository/cache";

const router = Router();

router.post(
  "/shorten",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { link } = req.body;
      if (!link) {
        return res.status(400).json({
          status: "error",
          message: "Link is required",
        });
      }

      let code = generateCode();
      let finalLink: any;

      for (let i = 0; i < 3; i++) {
        try {
          finalLink = await db.shortLink.create({
            data: { code: code, longUrl: link },
          });
          break;
        } catch (error: any) {
          if (error.code === "P2002") {
            finalLink = code = generateCode();
          } else {
            return res
              .status(500)
              .json({ status: "error", message: "Something went wrong" });
          }
        }
      }

      if (!finalLink) {
        return res
          .status(500)
          .json({ status: "error", message: "Failed to generate unique code" });
      } else {
        await redisCache.set(`short:${finalLink?.code}`, finalLink?.longUrl);
        const shortUrl = `${req.protocol}://${req.get("host")}/${
          finalLink?.code
        }`;

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
      next(error);
    }
  }
);

export default router;
