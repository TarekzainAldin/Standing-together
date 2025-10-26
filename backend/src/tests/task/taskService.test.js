"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskService = __importStar(require("../../services/task.service"));
const project_model_1 = __importDefault(require("../../models/project.model"));
const task_model_1 = __importDefault(require("../../models/task.model"));
const member_model_1 = __importDefault(require("../../models/member.model"));
const appError_1 = require("../../utils/appError");
const task_enum_1 = require("../../enums/task.enum");
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
        project_model_1.default.findById.mockResolvedValue(fakeProject);
        member_model_1.default.exists.mockResolvedValue(true);
        task_model_1.default.mockImplementation(() => fakeTask);
        const body = {
            title: "New Task",
            description: "desc",
            priority: task_enum_1.TaskPriorityEnum.HIGH,
            assignedTo: "u1",
        };
        const result = await taskService.createTaskService("ws1", "p1", "u1", body);
        expect(project_model_1.default.findById).toHaveBeenCalledWith("p1");
        expect(fakeTask.save).toHaveBeenCalled();
        expect(result.task.workspace).toBe("ws1");
    });
    it("createTaskService - should throw if project not found", async () => {
        project_model_1.default.findById.mockResolvedValue(null);
        await expect(taskService.createTaskService("ws1", "p1", "u1", {
            title: "Task",
            priority: task_enum_1.TaskPriorityEnum.MEDIUM,
        })).rejects.toThrow(appError_1.NotFoundException);
    });
    // UPDATE TASK
    it("updateTaskService - should update a task", async () => {
        const fakeProject = { _id: "p1", workspace: "ws1" };
        const fakeTask = { _id: "t1", project: "p1" };
        const updatedTask = { _id: "t1", title: "Updated" };
        project_model_1.default.findById.mockResolvedValue(fakeProject);
        task_model_1.default.findById.mockResolvedValue(fakeTask);
        task_model_1.default.findByIdAndUpdate.mockResolvedValue(updatedTask);
        const result = await taskService.updateTaskService("ws1", "p1", "t1", {
            title: "Updated",
            priority: task_enum_1.TaskPriorityEnum.MEDIUM,
        });
        expect(result.updatedTask).toEqual(updatedTask);
    });
    it("updateTaskService - should throw if project not found", async () => {
        project_model_1.default.findById.mockResolvedValue(null);
        await expect(taskService.updateTaskService("ws1", "p1", "t1", {
            title: "Updated",
            priority: task_enum_1.TaskPriorityEnum.MEDIUM,
        })).rejects.toThrow(appError_1.NotFoundException);
    });
    it("updateTaskService - should throw if task not found", async () => {
        const fakeProject = { _id: "p1", workspace: "ws1" };
        project_model_1.default.findById.mockResolvedValue(fakeProject);
        task_model_1.default.findById.mockResolvedValue(null);
        await expect(taskService.updateTaskService("ws1", "p1", "t1", {
            title: "Updated",
            priority: task_enum_1.TaskPriorityEnum.MEDIUM,
        })).rejects.toThrow(appError_1.NotFoundException);
    });
    // GET ALL TASKS
    it("getAllTasksService - should return tasks with pagination", async () => {
        const fakeTasks = [{ _id: "t1", title: "Task 1" }];
        task_model_1.default.find.mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(fakeTasks),
        });
        task_model_1.default.countDocuments.mockResolvedValue(1);
        const result = await taskService.getAllTasksService("ws1", { projectId: "p1" }, { pageSize: 10, pageNumber: 1 });
        expect(result.tasks).toBeDefined();
        expect(result.pagination.totalCount).toBe(1);
    });
    // GET TASK BY ID
    it("getTaskByIdService - should return task", async () => {
        const fakeProject = { _id: "p1", workspace: "ws1" };
        const fakeTask = { _id: "t1", project: "p1" };
        project_model_1.default.findById.mockResolvedValue(fakeProject);
        task_model_1.default.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(fakeTask),
        });
        const result = await taskService.getTaskByIdService("ws1", "p1", "t1");
        expect(result).toEqual(fakeTask);
    });
    it("getTaskByIdService - should throw if project not found", async () => {
        project_model_1.default.findById.mockResolvedValue(null);
        await expect(taskService.getTaskByIdService("ws1", "p1", "t1")).rejects.toThrow(appError_1.NotFoundException);
    });
    it("getTaskByIdService - should throw if task not found", async () => {
        const fakeProject = { _id: "p1", workspace: "ws1" };
        project_model_1.default.findById.mockResolvedValue(fakeProject);
        task_model_1.default.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });
        await expect(taskService.getTaskByIdService("ws1", "p1", "t1")).rejects.toThrow(appError_1.NotFoundException);
    });
    // DELETE TASK
    it("deleteTaskService - should delete task", async () => {
        const fakeTask = { _id: "t1" };
        task_model_1.default.findOneAndDelete.mockResolvedValue(fakeTask);
        await expect(taskService.deleteTaskService("ws1", "t1")).resolves.not.toThrow();
        expect(task_model_1.default.findOneAndDelete).toHaveBeenCalledWith({
            _id: "t1",
            workspace: "ws1",
        });
    });
    it("deleteTaskService - should throw if task not found", async () => {
        task_model_1.default.findOneAndDelete.mockResolvedValue(null);
        await expect(taskService.deleteTaskService("ws1", "t1")).rejects.toThrow(appError_1.NotFoundException);
    });
});
//# sourceMappingURL=taskService.test.js.map