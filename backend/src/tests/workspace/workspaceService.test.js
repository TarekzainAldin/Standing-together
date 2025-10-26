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
// src/__tests__/workspace/workspaceService.test.ts
const mongoose_1 = __importDefault(require("mongoose"));
const workspaceService = __importStar(require("../../services/workspace.service"));
const workspace_model_1 = __importDefault(require("../../models/workspace.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const member_model_1 = __importDefault(require("../../models/member.model"));
const roles_permission_model_1 = __importDefault(require("../../models/roles-permission.model"));
const task_model_1 = __importDefault(require("../../models/task.model"));
const project_model_1 = __importDefault(require("../../models/project.model"));
const appError_1 = require("../../utils/appError");
// Mock all Mongoose models
jest.mock("../../models/workspace.model");
jest.mock("../../models/user.model");
jest.mock("../../models/member.model");
jest.mock("../../models/roles-permission.model");
jest.mock("../../models/task.model");
jest.mock("../../models/project.model");
// Mock Mongoose startSession
const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
};
jest.spyOn(mongoose_1.default, "startSession").mockResolvedValue(mockSession);
describe("Workspace Services", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("createWorkspaceService - should create a workspace and member", async () => {
        const fakeUser = { _id: "user1", currentWorkspace: null, save: jest.fn() };
        user_model_1.default.findById.mockResolvedValue(fakeUser);
        const fakeRole = { _id: "role1" };
        roles_permission_model_1.default.findOne.mockResolvedValue(fakeRole);
        const fakeWorkspace = { _id: "ws1", save: jest.fn() };
        workspace_model_1.default.mockImplementation(() => fakeWorkspace);
        const fakeMember = { save: jest.fn() };
        member_model_1.default.mockImplementation(() => fakeMember);
        const result = await workspaceService.createWorkspaceService("user1", {
            name: "Workspace 1",
            description: "Desc",
        });
        expect(result.workspace).toBe(fakeWorkspace);
        expect(fakeUser.currentWorkspace).toBe(fakeWorkspace._id);
    });
    it("createWorkspaceService - should throw NotFoundException if user not found", async () => {
        user_model_1.default.findById.mockResolvedValue(null);
        await expect(workspaceService.createWorkspaceService("user1", { name: "W" })).rejects.toThrow(appError_1.NotFoundException);
    });
    it("getAllWorkspacesUserIsMemberService - should return all workspaces user is member of", async () => {
        const memberships = [
            { workspaceId: { _id: "ws1", name: "W1" } },
            { workspaceId: { _id: "ws2", name: "W2" } },
        ];
        member_model_1.default.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(memberships),
        });
        const result = await workspaceService.getAllWorkspacesUserIsMemberService("user1");
        expect(result.workspaces).toHaveLength(2);
    });
    it("getWorkspaceByIdService - should return workspace with members", async () => {
        const fakeWorkspace = { _id: "ws1", toObject: () => ({ _id: "ws1" }) };
        workspace_model_1.default.findById.mockResolvedValue(fakeWorkspace);
        member_model_1.default.find.mockReturnValue({
            populate: jest.fn().mockResolvedValue([{ userId: "user1", role: "role1" }]),
        });
        const result = await workspaceService.getWorkspaceByIdService("ws1");
        expect(result.workspace.members).toBeDefined();
    });
    it("getWorkspaceByIdService - should throw NotFoundException if workspace not found", async () => {
        workspace_model_1.default.findById.mockResolvedValue(null);
        await expect(workspaceService.getWorkspaceByIdService("ws1")).rejects.toThrow(appError_1.NotFoundException);
    });
    it("getWorkspaceMembersService - should return members and roles", async () => {
        const fakeMembers = [{ userId: { name: "John" }, role: { name: "Owner" } }];
        const fakeRoles = [{ _id: "role1", name: "Owner" }];
        // ✅ Mongoose mock chain: find → populate → populate → resolved Promise
        const populateMock2 = jest.fn().mockResolvedValue(fakeMembers);
        const populateMock1 = jest.fn().mockReturnValue({ populate: populateMock2 });
        member_model_1.default.find.mockReturnValue({ populate: populateMock1 });
        // ✅ RoleModel mock chain: find → select → lean → resolved Promise
        const leanMock = jest.fn().mockResolvedValue(fakeRoles);
        const selectMock = jest.fn().mockReturnValue({ lean: leanMock });
        roles_permission_model_1.default.find.mockReturnValue({ select: selectMock });
        // ✅ Call service
        const result = await workspaceService.getWorkspaceMembersService(new mongoose_1.default.Types.ObjectId().toString());
        // ✅ Assertions
        expect(populateMock1).toHaveBeenCalled();
        expect(populateMock2).toHaveBeenCalled();
        expect(result.members).toEqual(fakeMembers);
        expect(result.roles).toEqual(fakeRoles);
    });
    it("changeMemberRoleService - should change role of member", async () => {
        const fakeWorkspace = { _id: "ws1" };
        workspace_model_1.default.findById.mockResolvedValue(fakeWorkspace);
        const fakeRole = { _id: "role2" };
        roles_permission_model_1.default.findById.mockResolvedValue(fakeRole);
        const fakeMember = { role: "role1", save: jest.fn() };
        member_model_1.default.findOne.mockResolvedValue(fakeMember);
        const result = await workspaceService.changeMemberRoleService("ws1", "user1", "role2");
        expect(result.member.role).toBe(fakeRole);
    });
    it("getWorkspaceAnalyticsService - should return analytics object", async () => {
        task_model_1.default.countDocuments
            .mockResolvedValueOnce(10)
            .mockResolvedValueOnce(2)
            .mockResolvedValueOnce(5);
        const result = await workspaceService.getWorkspaceAnalyticsService("ws1");
        expect(result.analytics.totalTasks).toBe(10);
        expect(result.analytics.overdueTasks).toBe(2);
        expect(result.analytics.completedTasks).toBe(5);
    });
    it("updateWorkspaceByIdService - should update workspace", async () => {
        const fakeWorkspace = { _id: "ws1", name: "Old", description: "Old", save: jest.fn() };
        workspace_model_1.default.findById.mockResolvedValue(fakeWorkspace);
        const result = await workspaceService.updateWorkspaceByIdService("ws1", "New", "New Desc");
        expect(result.workspace.name).toBe("New");
        expect(result.workspace.description).toBe("New Desc");
    });
    it("deleteWorkspaceService - should delete workspace", async () => {
        const objId = new mongoose_1.default.Types.ObjectId();
        const fakeWorkspace = {
            _id: objId,
            owner: objId, // must match userId
            deleteOne: jest.fn(),
            equals: function (other) { return this._id.toString() === other.toString(); },
        };
        const fakeUser = { _id: objId, currentWorkspace: objId, save: jest.fn() };
        workspace_model_1.default.findById.mockImplementation(() => ({ session: jest.fn().mockResolvedValue(fakeWorkspace) }));
        user_model_1.default.findById.mockImplementation(() => ({ session: jest.fn().mockResolvedValue(fakeUser) }));
        member_model_1.default.findOne.mockReturnValue({ session: jest.fn().mockResolvedValue({ workspaceId: new mongoose_1.default.Types.ObjectId() }) });
        project_model_1.default.deleteMany.mockReturnValue({ session: jest.fn() });
        task_model_1.default.deleteMany.mockReturnValue({ session: jest.fn() });
        member_model_1.default.deleteMany.mockReturnValue({ session: jest.fn() });
        const result = await workspaceService.deleteWorkspaceService(objId.toString(), objId.toString());
        expect(result.currentWorkspace).toBeDefined();
        expect(fakeWorkspace.deleteOne).toHaveBeenCalled();
        expect(fakeUser.save).toHaveBeenCalled();
    });
});
//# sourceMappingURL=workspaceService.test.js.map