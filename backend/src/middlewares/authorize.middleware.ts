import { Request, Response, NextFunction } from "express";
import WorkspaceModel from "../models/workspace.model";

/**
 * يسمح فقط للـ Owner أو Admin (لو موجود) بإنشاء التقارير
 */
export const authorizeReportGeneration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const workspace = await WorkspaceModel.findById(currentWorkspaceId).lean();
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
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
