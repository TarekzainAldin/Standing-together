// src/__tests__/workspace/workspaceService.test.ts
import mongoose from "mongoose";
import * as workspaceService from "../../services/workspace.service";
import WorkspaceModel from "../../models/workspace.model";
import UserModel from "../../models/user.model";
import MemberModel from "../../models/member.model";
import RoleModel from "../../models/roles-permission.model";
import TaskModel from "../../models/task.model";
import ProjectModel from "../../models/project.model";
import { Roles } from "../../enums/role.enum";
import { BadRequestException, NotFoundException } from "../../utils/appError";
import { TaskStatusEnum } from "../../enums/task.enum";

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
jest.spyOn(mongoose, "startSession").mockResolvedValue(mockSession as any);

describe("Workspace Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createWorkspaceService - should create a workspace and member", async () => {
    const fakeUser: any = { _id: "user1", currentWorkspace: null, save: jest.fn() };
    (UserModel.findById as jest.Mock).mockResolvedValue(fakeUser);

    const fakeRole: any = { _id: "role1" };
    (RoleModel.findOne as jest.Mock).mockResolvedValue(fakeRole);

    const fakeWorkspace: any = { _id: "ws1", save: jest.fn() };
    (WorkspaceModel as any).mockImplementation(() => fakeWorkspace);

    const fakeMember: any = { save: jest.fn() };
    (MemberModel as any).mockImplementation(() => fakeMember);

    const result = await workspaceService.createWorkspaceService("user1", {
      name: "Workspace 1",
      description: "Desc",
    });

    expect(result.workspace).toBe(fakeWorkspace);
    expect(fakeUser.currentWorkspace).toBe(fakeWorkspace._id);
  });

  it("createWorkspaceService - should throw NotFoundException if user not found", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(null);
    await expect(
      workspaceService.createWorkspaceService("user1", { name: "W" })
    ).rejects.toThrow(NotFoundException);
  });

  it("getAllWorkspacesUserIsMemberService - should return all workspaces user is member of", async () => {
    const memberships: any = [
      { workspaceId: { _id: "ws1", name: "W1" } },
      { workspaceId: { _id: "ws2", name: "W2" } },
    ];
    (MemberModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(memberships),
    });

    const result = await workspaceService.getAllWorkspacesUserIsMemberService("user1");
    expect(result.workspaces).toHaveLength(2);
  });

  it("getWorkspaceByIdService - should return workspace with members", async () => {
    const fakeWorkspace: any = { _id: "ws1", toObject: () => ({ _id: "ws1" }) };
    (WorkspaceModel.findById as jest.Mock).mockResolvedValue(fakeWorkspace);
    (MemberModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue([{ userId: "user1", role: "role1" }]),
    });

    const result = await workspaceService.getWorkspaceByIdService("ws1");
    expect(result.workspace.members).toBeDefined();
  });

  it("getWorkspaceByIdService - should throw NotFoundException if workspace not found", async () => {
    (WorkspaceModel.findById as jest.Mock).mockResolvedValue(null);
    await expect(workspaceService.getWorkspaceByIdService("ws1")).rejects.toThrow(NotFoundException);
  });

  it("getWorkspaceMembersService - should return members and roles", async () => {
  const fakeMembers = [{ userId: { name: "John" }, role: { name: "Owner" } }];
  const fakeRoles = [{ _id: "role1", name: "Owner" }];

  // ✅ Mongoose mock chain: find → populate → populate → resolved Promise
  const populateMock2 = jest.fn().mockResolvedValue(fakeMembers);
  const populateMock1 = jest.fn().mockReturnValue({ populate: populateMock2 });
  (MemberModel.find as jest.Mock).mockReturnValue({ populate: populateMock1 });

  // ✅ RoleModel mock chain: find → select → lean → resolved Promise
  const leanMock = jest.fn().mockResolvedValue(fakeRoles);
  const selectMock = jest.fn().mockReturnValue({ lean: leanMock });
  (RoleModel.find as jest.Mock).mockReturnValue({ select: selectMock });

  // ✅ Call service
  const result = await workspaceService.getWorkspaceMembersService(
    new mongoose.Types.ObjectId().toString()
  );

  // ✅ Assertions
  expect(populateMock1).toHaveBeenCalled();
  expect(populateMock2).toHaveBeenCalled();
  expect(result.members).toEqual(fakeMembers);
  expect(result.roles).toEqual(fakeRoles);
});

  it("changeMemberRoleService - should change role of member", async () => {
    const fakeWorkspace: any = { _id: "ws1" };
    (WorkspaceModel.findById as jest.Mock).mockResolvedValue(fakeWorkspace);
    const fakeRole: any = { _id: "role2" };
    (RoleModel.findById as jest.Mock).mockResolvedValue(fakeRole);
    const fakeMember: any = { role: "role1", save: jest.fn() };
    (MemberModel.findOne as jest.Mock).mockResolvedValue(fakeMember);

    const result = await workspaceService.changeMemberRoleService("ws1", "user1", "role2");
    expect(result.member.role).toBe(fakeRole);
  });

  it("getWorkspaceAnalyticsService - should return analytics object", async () => {
    (TaskModel.countDocuments as jest.Mock)
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(5);
    const result = await workspaceService.getWorkspaceAnalyticsService("ws1");
    expect(result.analytics.totalTasks).toBe(10);
    expect(result.analytics.overdueTasks).toBe(2);
    expect(result.analytics.completedTasks).toBe(5);
  });

  it("updateWorkspaceByIdService - should update workspace", async () => {
    const fakeWorkspace: any = { _id: "ws1", name: "Old", description: "Old", save: jest.fn() };
    (WorkspaceModel.findById as jest.Mock).mockResolvedValue(fakeWorkspace);

    const result = await workspaceService.updateWorkspaceByIdService("ws1", "New", "New Desc");
    expect(result.workspace.name).toBe("New");
    expect(result.workspace.description).toBe("New Desc");
  });

  it("deleteWorkspaceService - should delete workspace", async () => {
    const objId = new mongoose.Types.ObjectId();
    const fakeWorkspace: any = {
      _id: objId,
      owner: objId, // must match userId
      deleteOne: jest.fn(),
      equals: function(other: any) { return this._id.toString() === other.toString(); },
    };
    const fakeUser: any = { _id: objId, currentWorkspace: objId, save: jest.fn() };

    (WorkspaceModel.findById as jest.Mock).mockImplementation(() => ({ session: jest.fn().mockResolvedValue(fakeWorkspace) }));
    (UserModel.findById as jest.Mock).mockImplementation(() => ({ session: jest.fn().mockResolvedValue(fakeUser) }));
    (MemberModel.findOne as jest.Mock).mockReturnValue({ session: jest.fn().mockResolvedValue({ workspaceId: new mongoose.Types.ObjectId() }) });
    (ProjectModel.deleteMany as jest.Mock).mockReturnValue({ session: jest.fn() });
    (TaskModel.deleteMany as jest.Mock).mockReturnValue({ session: jest.fn() });
    (MemberModel.deleteMany as jest.Mock).mockReturnValue({ session: jest.fn() });

    const result = await workspaceService.deleteWorkspaceService(objId.toString(), objId.toString());
    expect(result.currentWorkspace).toBeDefined();
    expect(fakeWorkspace.deleteOne).toHaveBeenCalled();
    expect(fakeUser.save).toHaveBeenCalled();
  });
});
