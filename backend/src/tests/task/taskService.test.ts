import mongoose from "mongoose";
import * as taskService from "../../services/task.service";
import ProjectModel from "../../models/project.model";
import TaskModel from "../../models/task.model";
import MemberModel from "../../models/member.model";
import { NotFoundException, BadRequestException } from "../../utils/appError";
import { TaskPriorityEnum, TaskStatusEnum } from "../../enums/task.enum";

jest.mock("../../models/project.model");
jest.mock("../../models/task.model");
jest.mock("../../models/member.model");

describe("Task Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CREATE TASK
  it("createTaskService - should create and return a task", async () => {
    const fakeProject = { _id: "p1", workspace: "ws1" };
    const fakeTask = { save: jest.fn(), workspace: "ws1" };

    (ProjectModel.findById as jest.Mock).mockResolvedValue(fakeProject);
    (MemberModel.exists as jest.Mock).mockResolvedValue(true);
    (TaskModel as unknown as jest.Mock).mockImplementation(() => fakeTask);

    const body = {
      title: "New Task",
      description: "desc",
      priority: TaskPriorityEnum.HIGH,
      assignedTo: "u1",
    };

    const result = await taskService.createTaskService("ws1", "p1", "u1", body);

    expect(ProjectModel.findById).toHaveBeenCalledWith("p1");
    expect(fakeTask.save).toHaveBeenCalled();
    expect(result.task.workspace).toBe("ws1");
  });

  it("createTaskService - should throw if project not found", async () => {
    (ProjectModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      taskService.createTaskService("ws1", "p1", "u1", {
        title: "Task",
        priority: TaskPriorityEnum.MEDIUM,
      })
    ).rejects.toThrow(NotFoundException);
  });

  // UPDATE TASK
  it("updateTaskService - should update a task", async () => {
    const fakeProject = { _id: "p1", workspace: "ws1" };
    const fakeTask = { _id: "t1", project: "p1" };
    const updatedTask = { _id: "t1", title: "Updated" };

    (ProjectModel.findById as jest.Mock).mockResolvedValue(fakeProject);
    (TaskModel.findById as jest.Mock).mockResolvedValue(fakeTask);
    (TaskModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTask);

    const result = await taskService.updateTaskService("ws1", "p1", "t1", {
      title: "Updated",
      priority: TaskPriorityEnum.MEDIUM,
    });

    expect(result.updatedTask).toEqual(updatedTask);
  });

  it("updateTaskService - should throw if project not found", async () => {
    (ProjectModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      taskService.updateTaskService("ws1", "p1", "t1", {
        title: "Updated",
        priority: TaskPriorityEnum.MEDIUM,
      })
    ).rejects.toThrow(NotFoundException);
  });

  it("updateTaskService - should throw if task not found", async () => {
    const fakeProject = { _id: "p1", workspace: "ws1" };
    (ProjectModel.findById as jest.Mock).mockResolvedValue(fakeProject);
    (TaskModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      taskService.updateTaskService("ws1", "p1", "t1", {
        title: "Updated",
        priority: TaskPriorityEnum.MEDIUM,
      })
    ).rejects.toThrow(NotFoundException);
  });

  // GET ALL TASKS
  it("getAllTasksService - should return tasks with pagination", async () => {
    const fakeTasks = [{ _id: "t1", title: "Task 1" }];

    (TaskModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(fakeTasks),
    });

    (TaskModel.countDocuments as jest.Mock).mockResolvedValue(1);

    const result = await taskService.getAllTasksService(
      "ws1",
      { projectId: "p1" },
      { pageSize: 10, pageNumber: 1 }
    );

    expect(result.tasks).toBeDefined();
    expect(result.pagination.totalCount).toBe(1);
  });

  // GET TASK BY ID
  it("getTaskByIdService - should return task", async () => {
    const fakeProject = { _id: "p1", workspace: "ws1" };
    const fakeTask = { _id: "t1", project: "p1" };

    (ProjectModel.findById as jest.Mock).mockResolvedValue(fakeProject);
    (TaskModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeTask),
    });

    const result = await taskService.getTaskByIdService("ws1", "p1", "t1");
    expect(result).toEqual(fakeTask);
  });

  it("getTaskByIdService - should throw if project not found", async () => {
    (ProjectModel.findById as jest.Mock).mockResolvedValue(null);
    await expect(
      taskService.getTaskByIdService("ws1", "p1", "t1")
    ).rejects.toThrow(NotFoundException);
  });

  it("getTaskByIdService - should throw if task not found", async () => {
    const fakeProject = { _id: "p1", workspace: "ws1" };
    (ProjectModel.findById as jest.Mock).mockResolvedValue(fakeProject);
    (TaskModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    await expect(
      taskService.getTaskByIdService("ws1", "p1", "t1")
    ).rejects.toThrow(NotFoundException);
  });

  // DELETE TASK
  it("deleteTaskService - should delete task", async () => {
    const fakeTask = { _id: "t1" };
    (TaskModel.findOneAndDelete as jest.Mock).mockResolvedValue(fakeTask);

    await expect(taskService.deleteTaskService("ws1", "t1")).resolves.not.toThrow();
    expect(TaskModel.findOneAndDelete).toHaveBeenCalledWith({
      _id: "t1",
      workspace: "ws1",
    });
  });

  it("deleteTaskService - should throw if task not found", async () => {
    (TaskModel.findOneAndDelete as jest.Mock).mockResolvedValue(null);

    await expect(taskService.deleteTaskService("ws1", "t1")).rejects.toThrow(
      NotFoundException
    );
  });
});
