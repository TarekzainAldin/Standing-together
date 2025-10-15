import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import WorkspaceModel from "../models/workspace.model";
import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";

/**
 * توليد تقرير Excel محسّن
 */
export const generateAnalysisReport = async (): Promise<string> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Analysis Report");

  // تعريف الأعمدة
  worksheet.columns = [
    { header: "Workspace", key: "workspace", width: 25 },
    { header: "Project", key: "project", width: 25 },
    { header: "Task", key: "task", width: 30 },
    { header: "Status", key: "status", width: 15 },
    { header: "Priority", key: "priority", width: 15 },
    { header: "Due Date", key: "dueDate", width: 20 },
  ];

  // إنشاء مجلد reports إذا لم يكن موجود
  const reportsDir = path.join(__dirname, "../reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  // جلب جميع الـ Workspaces
  const workspaces = await WorkspaceModel.find();

  for (const ws of workspaces) {
    let wsRowAdded = false; // للتحكم بعرض اسم الـ Workspace مرة واحدة
    const projects = await ProjectModel.find({ workspace: ws._id });

    for (const project of projects) {
      let projectRowAdded = false; // للتحكم بعرض اسم المشروع مرة واحدة
      const tasks = await TaskModel.find({ project: project._id });

      if (tasks.length > 0) {
        for (const task of tasks) {
          worksheet.addRow({
            workspace: wsRowAdded ? "" : ws.name,
            project: projectRowAdded ? "" : project.name,
            task: task.title,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
          });
          wsRowAdded = true;
          projectRowAdded = true;
        }
      } else {
        // المشروع بدون مهام
        worksheet.addRow({
          workspace: wsRowAdded ? "" : ws.name,
          project: project.name,
        });
        wsRowAdded = true;
      }
    }

    if (projects.length === 0) {
      // Workspace بدون مشاريع
      worksheet.addRow({ workspace: ws.name });
    }
  }

  const filePath = path.join(reportsDir, "AnalysisReport.xlsx");
  await workbook.xlsx.writeFile(filePath);

  console.log("Excel report generated at:", filePath);
  return filePath;
};
