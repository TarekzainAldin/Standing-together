// src/controllers/report.controller.ts
import { Request, Response } from "express";
import { generateAnalysisReport, generateSingleWorkspaceReport } from "../services/report.service";

export const generateReportController = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.query as { workspaceId?: string };

    // إذا أعطينا workspaceId → تقرير مساحة عمل واحدة، وإلا → كل المساحات
    const filePath = workspaceId
      ? await generateSingleWorkspaceReport(workspaceId)
      : await generateAnalysisReport();

    // تحديد اسم الملف من المسار
    const fileName = filePath.split("/").pop() || "AnalysisReport.xlsx";

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Failed to download report" });
      }
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};
