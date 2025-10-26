"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReportController = void 0;
const report_service_1 = require("../services/report.service");
const generateReportController = async (req, res) => {
    try {
        const { workspaceId } = req.query;
        // إذا أعطينا workspaceId → تقرير مساحة عمل واحدة، وإلا → كل المساحات
        const filePath = workspaceId
            ? await (0, report_service_1.generateSingleWorkspaceReport)(workspaceId)
            : await (0, report_service_1.generateAnalysisReport)();
        // تحديد اسم الملف من المسار
        const fileName = filePath.split("/").pop() || "AnalysisReport.xlsx";
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error("Error downloading file:", err);
                res.status(500).json({ message: "Failed to download report" });
            }
        });
    }
    catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: "Failed to generate report" });
    }
};
exports.generateReportController = generateReportController;
//# sourceMappingURL=report.controller.js.map