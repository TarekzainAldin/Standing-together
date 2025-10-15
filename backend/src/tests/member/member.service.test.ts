import mongoose from "mongoose";
import * as memberService from "../../services/member.service";
import MemberModel from "../../models/member.model";
import RoleModel from "../../models/roles-permission.model";
import WorkspaceModel from "../../models/workspace.model";
import { Roles } from "../../enums/role.enum";
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from "../../utils/appError";

// Mock Mongoose Models
jest.mock("../../models/member.model");
jest.mock("../../models/roles-permission.model");
jest.mock("../../models/workspace.model");

describe("Member Services", () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const workspaceId = new mongoose.Types.ObjectId().toString();
  const inviteCode = "INV123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== getMemberRoleInWorkspace =====
  it("getMemberRoleInWorkspace - should return role", async () => {
    const role = { _id: "role1", name: Roles.MEMBER };
    (MemberModel.findOne as any).mockReturnValue({
      populate: jest.fn().mockResolvedValue({ role }),
    });

    (WorkspaceModel.findById as any).mockResolvedValue({ _id: workspaceId });

    const result = await memberService.getMemberRoleInWorkspace(
      userId,
      workspaceId
    );

    expect(result).toEqual({ role: Roles.MEMBER });
  });

  it("getMemberRoleInWorkspace - should throw if workspace not found", async () => {
    (WorkspaceModel.findById as any).mockResolvedValue(null);

    await expect(
      memberService.getMemberRoleInWorkspace(userId, workspaceId)
    ).rejects.toThrow(NotFoundException);
  });

  it("getMemberRoleInWorkspace - should throw if member not found", async () => {
    (WorkspaceModel.findById as any).mockResolvedValue({ _id: workspaceId });
    (MemberModel.findOne as any).mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });

    await expect(
      memberService.getMemberRoleInWorkspace(userId, workspaceId)
    ).rejects.toThrow(UnauthorizedException);
  });

  // ===== joinWorkspaceByInviteService =====
  it("joinWorkspaceByInviteService - should add user to workspace", async () => {
    const role = { _id: "role1", name: Roles.MEMBER };
    const workspace = { _id: workspaceId };

    (WorkspaceModel.findOne as any).mockReturnValue({ exec: jest.fn().mockResolvedValue(workspace) });
    (MemberModel.findOne as any).mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    (RoleModel.findOne as any).mockResolvedValue(role);
    (MemberModel.prototype.save as any) = jest.fn().mockResolvedValue({});

    const result = await memberService.joinWorkspaceByInviteService(userId, inviteCode);

    expect(result).toEqual({ workspaceId, role: Roles.MEMBER });
    expect(MemberModel.prototype.save).toHaveBeenCalled();
  });

  it("joinWorkspaceByInviteService - should throw if workspace not found", async () => {
    (WorkspaceModel.findOne as any).mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

    await expect(
      memberService.joinWorkspaceByInviteService(userId, inviteCode)
    ).rejects.toThrow(NotFoundException);
  });

  it("joinWorkspaceByInviteService - should throw if already a member", async () => {
    const workspace = { _id: workspaceId };
    (WorkspaceModel.findOne as any).mockReturnValue({ exec: jest.fn().mockResolvedValue(workspace) });
    (MemberModel.findOne as any).mockReturnValue({ exec: jest.fn().mockResolvedValue({}) });

    await expect(
      memberService.joinWorkspaceByInviteService(userId, inviteCode)
    ).rejects.toThrow(BadRequestException);
  });

  it("joinWorkspaceByInviteService - should throw if role not found", async () => {
    const workspace = { _id: workspaceId };
    (WorkspaceModel.findOne as any).mockReturnValue({ exec: jest.fn().mockResolvedValue(workspace) });
    (MemberModel.findOne as any).mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    (RoleModel.findOne as any).mockResolvedValue(null);

    await expect(
      memberService.joinWorkspaceByInviteService(userId, inviteCode)
    ).rejects.toThrow(NotFoundException);
  });
});
