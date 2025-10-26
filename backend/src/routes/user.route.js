"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const usreRoutes = (0, express_1.Router)();
usreRoutes.get("/current", user_controller_1.getCurrentUserController);
exports.default = usreRoutes;
//# sourceMappingURL=user.route.js.map