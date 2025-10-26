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
const projectService = __importStar(require("../../services/project.service"));
const project_model_1 = __importDefault(require("../../models/project.model"));
const task_model_1 = __importDefault(require("../../models/task.model"));
const appError_1 = require("../../utils/appError");
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
        project_model_1.default.mockImplementation(() => fakeProject);
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
        project_model_1.default.countDocuments.mockResolvedValue(2);
        project_model_1.default.find.mockReturnValue({
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
        project_model_1.default.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(fakeProject),
        });
        const result = await projectService.getProjectByIdAndWorkspaceIdService("ws1", "507f1f77bcf86cd799439011");
        expect(result.project).toEqual(fakeProject);
    });
    it("getProjectByIdAndWorkspaceIdService - should throw if project not found", async () => {
        project_model_1.default.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(null),
        });
        await expect(projectService.getProjectByIdAndWorkspaceIdService("ws1", "507f1f77bcf86cd799439011")).rejects.toThrow(appError_1.NotFoundException);
    });
    // PROJECT ANALYTICS
    it("getProjectAnalyticsService - should return analytics", async () => {
        const fakeProject = { _id: "507f1f77bcf86cd799439011", workspace: "ws1" };
        project_model_1.default.findById.mockResolvedValue(fakeProject);
        task_model_1.default.aggregate.mockResolvedValue([
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
        project_model_1.default.findById.mockResolvedValue(null);
        await expect(projectService.getProjectAnalyticsService("ws1", "507f1f77bcf86cd799439011")).rejects.toThrow(appError_1.NotFoundException);
    });
    // UPDATE PROJECT
    it("updateProjectService - should update project fields", async () => {
        const fakeProject = {
            name: "Old",
            save: jest.fn(),
        };
        project_model_1.default.findOne.mockResolvedValue(fakeProject);
        const result = await projectService.updateProjectService("ws1", "p1", { name: "Updated" });
        expect(fakeProject.name).toBe("Updated");
        expect(fakeProject.save).toHaveBeenCalled();
        expect(result.project).toBe(fakeProject);
    });
    it("updateProjectService - should throw if project not found", async () => {
        project_model_1.default.findOne.mockResolvedValue(null);
        await expect(projectService.updateProjectService("ws1", "p1", { name: "Updated" })).rejects.toThrow(appError_1.NotFoundException);
    });
    // DELETE PROJECT
    it("deleteProjectService - should delete project and tasks", async () => {
        const fakeProject = {
            _id: "507f1f77bcf86cd799439011",
            deleteOne: jest.fn(),
        };
        project_model_1.default.findOne.mockResolvedValue(fakeProject);
        task_model_1.default.deleteMany.mockResolvedValue({ deletedCount: 2 });
        const result = await projectService.deleteProjectService("ws1", "507f1f77bcf86cd799439011");
        expect(fakeProject.deleteOne).toHaveBeenCalled();
        expect(task_model_1.default.deleteMany).toHaveBeenCalledWith({ project: fakeProject._id });
        expect(result).toBe(fakeProject);
    });
    it("deleteProjectService - should throw if project not found", async () => {
        project_model_1.default.findOne.mockResolvedValue(null);
        await expect(projectService.deleteProjectService("ws1", "507f1f77bcf86cd799439011")).rejects.toThrow(appError_1.NotFoundException);
    });
});
//# sourceMappingURL=projectService.test.js.map