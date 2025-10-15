import express from "express";
import { passportAuthenticateJWT } from "../config/passport.config";
import { authorizeReportGeneration } from "../middlewares/authorize.middleware";
import { generateReportController } from "../controllers/report.controller";

const router = express.Router();

router.get(
  "/generate",
  passportAuthenticateJWT,
  authorizeReportGeneration,
  generateReportController
);

export default router;
