import mongoose from "mongoose";
import * as projectService from "../../services/project.service";
import ProjectModel from "../../models/project.model";
import TaskModel from "../../models/task.model";
import { NotFoundException } from "../../utils/appError";
import { TaskStatusEnum } from "../../enums/task.enum";

// Mocks
jest.mock("../../models/project.model");
jest.mock("../../models/task.model");

describe("Project Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CREATE PROJECT
  it("createProjectService - should create and return project", async () => {
    const fakeProject = {
      workspace: "ws1",
      save: jest.fn(),
    };
    (ProjectModel as any).mockImplementation(() => fakeProject);

    const result = await projectService.createProjectService("user1", "ws1", {
      name: "New Project",
    });

    expect(fakeProject.save).toHaveBeenCalled();
    expect(result.project).toBe(fakeProject);
    expect(result.project.workspace).toBe("ws1");
  });

  // GET PROJECTS IN WORKSPACE
  it("getProjectsInWorkspaceService - should return paginated projects", async () => {
    const fakeProjects = [{ name: "P1" }, { name: "P2" }];
    (ProjectModel.countDocuments as any).mockResolvedValue(2);
    (ProjectModel.find as any).mockReturnValue({
      skip: () => ({
        limit: () => ({
          populate: () => ({
            sort: () => fakeProjects,
          }),
        }),
      }),
    });

    const result = await projectService.getProjectsInWorkspaceService("ws1", 2, 1);
    expect(result.projects).toEqual(fakeProjects);
    expect(result.totalCount).toBe(2);
    expect(result.totalPages).toBe(1);
  });

  // GET PROJECT BY ID
  it("getProjectByIdAndWorkspaceIdService - should return project", async () => {
    const fakeProject = { _id: "507f1f77bcf86cd799439011", name: "P1" };

    (ProjectModel.findOne as any).mockReturnValue({
      select: jest.fn().mockResolvedValue(fakeProject),
    });

    const result = await projectService.getProjectByIdAndWorkspaceIdService("ws1", "507f1f77bcf86cd799439011");
    expect(result.project).toEqual(fakeProject);
  });

  it("getProjectByIdAndWorkspaceIdService - should throw if project not found", async () => {
    (ProjectModel.findOne as any).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(
      projectService.getProjectByIdAndWorkspaceIdService("ws1", "507f1f77bcf86cd799439011")
    ).rejects.toThrow(NotFoundException);
  });

  // PROJECT ANALYTICS
  it("getProjectAnalyticsService - should return analytics", async () => {
    const fakeProject = { _id: "507f1f77bcf86cd799439011", workspace: "ws1" };
    (ProjectModel.findById as any).mockResolvedValue(fakeProject);
    (TaskModel.aggregate as any).mockResolvedValue([
      {
        totalTasks: [{ count: 5 }],
        overdueTasks: [{ count: 1 }],
        completedTasks: [{ count: 2 }],
      },
    ]);

    const result = await projectService.getProjectAnalyticsService("ws1", "507f1f77bcf86cd799439011");
    expect(result.analytics).toEqual({
      totalTasks: 5,
      overdueTasks: 1,
      completedTasks: 2,
    });
  });

  it("getProjectAnalyticsService - should throw if project not found", async () => {
    (ProjectModel.findById as any).mockResolvedValue(null);

    await expect(
      projectService.getProjectAnalyticsService("ws1", "507f1f77bcf86cd799439011")
    ).rejects.toThrow(NotFoundException);
  });

  // UPDATE PROJECT
  it("updateProjectService - should update project fields", async () => {
    const fakeProject = {
      name: "Old",
      save: jest.fn(),
    };
    (ProjectModel.findOne as any).mockResolvedValue(fakeProject);

    const result = await projectService.updateProjectService("ws1", "p1", { name: "Updated" });

    expect(fakeProject.name).toBe("Updated");
    expect(fakeProject.save).toHaveBeenCalled();
    expect(result.project).toBe(fakeProject);
  });

  it("updateProjectService - should throw if project not found", async () => {
    (ProjectModel.findOne as any).mockResolvedValue(null);

    await expect(
      projectService.updateProjectService("ws1", "p1", { name: "Updated" })
    ).rejects.toThrow(NotFoundException);
  });

  // DELETE PROJECT
  it("deleteProjectService - should delete project and tasks", async () => {
    const fakeProject = {
      _id: "507f1f77bcf86cd799439011",
      deleteOne: jest.fn(),
    };
    (ProjectModel.findOne as any).mockResolvedValue(fakeProject);
    (TaskModel.deleteMany as any).mockResolvedValue({ deletedCount: 2 });

    const result = await projectService.deleteProjectService("ws1", "507f1f77bcf86cd799439011");

    expect(fakeProject.deleteOne).toHaveBeenCalled();
    expect(TaskModel.deleteMany).toHaveBeenCalledWith({ project: fakeProject._id });
    expect(result).toBe(fakeProject);
  });

  it("deleteProjectService - should throw if project not found", async () => {
    (ProjectModel.findOne as any).mockResolvedValue(null);

    await expect(
      projectService.deleteProjectService("ws1", "507f1f77bcf86cd799439011")
    ).rejects.toThrow(NotFoundException);
  });
});
