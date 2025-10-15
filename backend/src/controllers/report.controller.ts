import { Request, Response } from "express";
import { generateAnalysisReport } from "../services/report.service";

export const generateReportController = async (req: Request, res: Response) => {
  try {
    const filePath = await generateAnalysisReport();
    res.download(filePath, "AnalysisReport.xlsx");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};
