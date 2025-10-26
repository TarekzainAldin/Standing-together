"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeReportGeneration = void 0;
const workspace_model_1 = __importDefault(require("../models/workspace.model"));
/**
 * يسمح فقط للـ Owner أو Admin (لو موجود) بإنشاء التقارير
 */
const authorizeReportGeneration = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const currentWorkspaceId = user.currentWorkspace?._id || user.currentWorkspace;
        if (!currentWorkspaceId) {
            return res.status(400).json({ message: "No current workspace" });
        }
        // جلب الـ workspace
        const workspace = await workspace_model_1.default.findById(currentWorkspaceId).lean();
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        // السماح فقط للمالك
        if (workspace.owner.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "Access denied: Only workspace owner can generate reports.",
            });
        }
        next();
    }
    catch (error) {
        console.error("Authorization error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.authorizeReportGeneration = authorizeReportGeneration;
//# sourceMappingURL=authorize.middleware.js.map