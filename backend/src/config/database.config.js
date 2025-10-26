"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_config_1 = require("./app.config");
const connectDatabase = async () => {
    try {
        await mongoose_1.default.connect(app_config_1.config.MONGO_URI);
        console.log("Connected to MONGO dtabase");
    }
    catch (erro) {
        console.log("Error connection to Mango database");
        process.exit(1);
    }
};
exports.default = connectDatabase;
//# sourceMappingURL=database.config.js.map