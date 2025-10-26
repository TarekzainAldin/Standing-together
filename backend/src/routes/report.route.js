"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_config_1 = require("../config/passport.config");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const report_controller_1 = require("../controllers/report.controller");
const router = express_1.default.Router();
router.get("/generate", passport_config_1.passportAuthenticateJWT, authorize_middleware_1.authorizeReportGeneration, report_controller_1.generateReportController);
exports.default = router;
//# sourceMappingURL=report.route.js.map