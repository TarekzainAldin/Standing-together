import { Request,Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getCurrentUserService } from "../services/user.service";


export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: "User not authenticated" });
    }

    // TypeScript الآن يعرف _id
    const userId: string = req.user._id.toString();

    const { user } = await getCurrentUserService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Successfully logged in",
      user,
    });
  }
);
