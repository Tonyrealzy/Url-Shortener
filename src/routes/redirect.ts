import { Router, Request, Response, NextFunction } from "express";
import { redisCache } from "../repository/cache";
import db from "../repository/db";

const router = Router();

router.get(
  "/:code",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params;

      if (!code) {
        return res.status(400).json({
          status: "error",
          message: "Code is required",
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
        return res.status(404).json({
          status: "error",
          message: "Link not found",
        });
      } else {
        await redisCache.set(`short:${code}`, link.longUrl);
        return res.redirect(link.longUrl);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
