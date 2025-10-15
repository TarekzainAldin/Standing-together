import mongoose from "mongoose";
import { registerUserService } from "../../services/auth.service";
import UserModel from "../../models/user.model";
import AccountModel from "../../models/account.model";
import WorkspaceModel from "../../models/workspace.model";
import RoleModel from "../../models/roles-permission.model";
import MemberModel from "../../models/member.model";
import { BadRequestException, NotFoundException } from "../../utils/appError";

// Mock startSession فقط
(mongoose as any).startSession = jest.fn().mockResolvedValue({
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
});

// Mock النماذج
jest.mock("../../models/user.model");
jest.mock("../../models/account.model");
jest.mock("../../models/workspace.model");
jest.mock("../../models/roles-permission.model");
jest.mock("../../models/member.model");

describe("registerUserService", () => {
  let mockSession: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    (mongoose.startSession as jest.Mock).mockResolvedValue(mockSession);
  });

  it("should create user, account, workspace, and member successfully", async () => {
    const fakeUser = { _id: "user1", save: jest.fn(), name: "John", email: "john@test.com", currentWorkspace: null };
    const fakeWorkspace = { _id: "ws1", save: jest.fn() };
    const fakeRole = { _id: "role1" };

    // Mock findOne().session() للسطر اللي يتحقق من وجود المستخدم
    (UserModel.findOne as jest.Mock).mockImplementation(() => ({
      session: jest.fn().mockResolvedValue(null), // لا يوجد مستخدم
    }));

    // Mock constructors
    (UserModel as any).mockImplementation(() => fakeUser);
    (AccountModel as any).mockImplementation(() => ({ save: jest.fn() }));
    (WorkspaceModel as any).mockImplementation(() => fakeWorkspace);
    (RoleModel.findOne as jest.Mock).mockImplementation(() => ({
      session: jest.fn().mockResolvedValue(fakeRole),
    }));
    (MemberModel as any).mockImplementation(() => ({ save: jest.fn() }));

    const result = await registerUserService({
      email: "john@test.com",
      name: "John",
      password: "1234",
    });

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: "john@test.com" });
    expect(result.userId).toBe("user1");
    expect(result.workspaceId).toBe("ws1");
    expect(mockSession.commitTransaction).toHaveBeenCalled();
  });

  it("should throw BadRequestException if user already exists", async () => {
    (UserModel.findOne as jest.Mock).mockImplementation(() => ({
      session: jest.fn().mockResolvedValue({ _id: "user1", email: "john@test.com" }), // مستخدم موجود
    }));

    await expect(
      registerUserService({ email: "john@test.com", name: "John", password: "123" })
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw NotFoundException if owner role not found", async () => {
    (UserModel.findOne as jest.Mock).mockImplementation(() => ({
      session: jest.fn().mockResolvedValue(null), // لا يوجد مستخدم
    }));

    (UserModel as any).mockImplementation(() => ({ save: jest.fn(), _id: "user1" }));
    (AccountModel as any).mockImplementation(() => ({ save: jest.fn() }));
    (WorkspaceModel as any).mockImplementation(() => ({ save: jest.fn(), _id: "ws1" }));

    (RoleModel.findOne as jest.Mock).mockImplementation(() => ({
      session: jest.fn().mockResolvedValue(null), // role غير موجود
    }));

    await expect(
      registerUserService({ email: "noRole@test.com", name: "John", password: "123" })
    ).rejects.toThrow(NotFoundException);
  });
});
