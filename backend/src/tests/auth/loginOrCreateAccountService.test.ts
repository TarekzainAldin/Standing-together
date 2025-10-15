import mongoose from "mongoose";
import {
  loginOrCreateAccountService,
  verifyUserService,
  findUserByIdService,
} from "../../services/auth.service";
import UserModel from "../../models/user.model";
import AccountModel from "../../models/account.model";
import WorkspaceModel from "../../models/workspace.model";
import RoleModel from "../../models/roles-permission.model";
import MemberModel from "../../models/member.model";
import { NotFoundException, UnauthorizedException } from "../../utils/appError";

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

describe("Login Services", () => {
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

  describe("loginOrCreateAccountService", () => {
    it("should create a new user if not exists", async () => {
      const fakeUser = { _id: "user1", save: jest.fn(), currentWorkspace: null };
      const fakeWorkspace = { _id: "ws1", save: jest.fn() };
      const fakeRole = { _id: "role1" };

      (UserModel.findOne as jest.Mock).mockImplementation(() => ({
        session: jest.fn().mockResolvedValue(null),
      }));
      (UserModel as any).mockImplementation(() => fakeUser);
      (AccountModel as any).mockImplementation(() => ({ save: jest.fn() }));
      (WorkspaceModel as any).mockImplementation(() => fakeWorkspace);
      (RoleModel.findOne as jest.Mock).mockImplementation(() => ({
        session: jest.fn().mockResolvedValue(fakeRole),
      }));
      (MemberModel as any).mockImplementation(() => ({ save: jest.fn() }));

      const result = await loginOrCreateAccountService({
        provider: "google",
        displayName: "John",
        providerId: "123",
        email: "john@test.com",
      });

      expect(result.user._id).toBe("user1");
      expect(mockSession.commitTransaction).toHaveBeenCalled();
    });
  });

  describe("verifyUserService", () => {
    it("should return user if password matches", async () => {
      const fakeUser: any = {
        _id: "user1",
        comparePassword: jest.fn().mockResolvedValue(true),
        omitPassword: jest.fn().mockReturnValue({ _id: "user1" }),
      };

      (AccountModel.findOne as jest.Mock).mockResolvedValue({ userId: "user1" });
      (UserModel.findById as jest.Mock).mockResolvedValue(fakeUser);

      const result = await verifyUserService({ email: "test@test.com", password: "123" });
      expect(result._id).toBe("user1");
    });

    it("should throw NotFoundException if account not found", async () => {
      (AccountModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        verifyUserService({ email: "noone@test.com", password: "123" })
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw UnauthorizedException if password wrong", async () => {
      const fakeUser: any = {
        comparePassword: jest.fn().mockResolvedValue(false),
        omitPassword: jest.fn(),
      };

      (AccountModel.findOne as jest.Mock).mockResolvedValue({ userId: "user1" });
      (UserModel.findById as jest.Mock).mockResolvedValue(fakeUser);

      await expect(
        verifyUserService({ email: "test@test.com", password: "wrong" })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("findUserByIdService", () => {
    it("should return user if found", async () => {
      const fakeUser = { _id: "user1", email: "test@test.com" };
      (UserModel.findById as jest.Mock).mockResolvedValue(fakeUser);

      const result = await findUserByIdService("user1");
      expect(result).toEqual(fakeUser);
    });

    it("should return null if not found", async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      const result = await findUserByIdService("noone");
      expect(result).toBeNull();
    });
  });
});
