// src/services/report.service.ts
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import WorkspaceModel, { WorkspaceDocument } from "../models/workspace.model";
import ProjectModel, { ProjectDocument } from "../models/project.model";
import TaskModel, { TaskDocument } from "../models/task.model";

/**
 * تقرير لكل المساحات
 */
export const generateAnalysisReport = async (): Promise<string> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Analysis Report");

  worksheet.columns = [
    { header: "Workspace", key: "workspace", width: 25 },
    { header: "Project", key: "project", width: 25 },
    { header: "Task", key: "task", width: 30 },
    { header: "Status", key: "status", width: 15 },
    { header: "Priority", key: "priority", width: 15 },
    { header: "Due Date", key: "dueDate", width: 20 },
  ];

  const reportsDir = path.join(__dirname, "../reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

  // جلب كل المساحات كـ Lean objects
  const workspaces: WorkspaceDocument[] = await WorkspaceModel.find().lean();

  for (const ws of workspaces) {
    const projects: ProjectDocument[] = await ProjectModel.find({ workspace: ws._id }).lean();
    for (const project of projects) {
      const tasks: TaskDocument[] = await TaskModel.find({ project: project._id }).lean();
      if (tasks.length > 0) {
        for (const task of tasks) {
          worksheet.addRow({
            workspace: ws.name,
            project: project.name,
            task: task.title,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
          });
        }
      } else {
        worksheet.addRow({ workspace: ws.name, project: project.name });
      }
    }
    if (projects.length === 0) {
      worksheet.addRow({ workspace: ws.name });
    }
  }

  const today = new Date().toISOString().split("T")[0];
  const filePath = path.join(reportsDir, `Report_AllWorkspaces_${today}.xlsx`);
  await workbook.xlsx.writeFile(filePath);

  return filePath;
};

/**
 * تقرير لمساحة عمل واحدة
 */
export const generateSingleWorkspaceReport = async (workspaceId: string): Promise<string> => {
  const workspace: WorkspaceDocument | null = await WorkspaceModel.findById(workspaceId).lean();
  if (!workspace) throw new Error("Workspace not found");

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Analysis Report");

  worksheet.columns = [
    { header: "Workspace", key: "workspace", width: 25 },
    { header: "Project", key: "project", width: 25 },
    { header: "Task", key: "task", width: 30 },
    { header: "Status", key: "status", width: 15 },
    { header: "Priority", key: "priority", width: 15 },
    { header: "Due Date", key: "dueDate", width: 20 },
  ];

  const reportsDir = path.join(__dirname, "../reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

  const projects: ProjectDocument[] = await ProjectModel.find({ workspace: workspace._id }).lean();
  for (const project of projects) {
    const tasks: TaskDocument[] = await TaskModel.find({ project: project._id }).lean();
    if (tasks.length > 0) {
      for (const task of tasks) {
        worksheet.addRow({
          workspace: workspace.name,
          project: project.name,
          task: task.title,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
        });
      }
    } else {
      worksheet.addRow({ workspace: workspace.name, project: project.name });
    }
  }
  if (projects.length === 0) {
    worksheet.addRow({ workspace: workspace.name });
  }

  const today = new Date().toISOString().split("T")[0];
  const filePath = path.join(reportsDir, `Report_${workspace.name}_${today}.xlsx`);
  await workbook.xlsx.writeFile(filePath);

  return filePath;
};
