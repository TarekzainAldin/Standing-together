"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const auth_service_1 = require("../../services/auth.service");
const user_model_1 = __importDefault(require("../../models/user.model"));
const account_model_1 = __importDefault(require("../../models/account.model"));
const workspace_model_1 = __importDefault(require("../../models/workspace.model"));
const roles_permission_model_1 = __importDefault(require("../../models/roles-permission.model"));
const member_model_1 = __importDefault(require("../../models/member.model"));
const appError_1 = require("../../utils/appError");
// Mock startSession فقط
mongoose_1.default.startSession = jest.fn().mockResolvedValue({
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
    let mockSession;
    beforeEach(() => {
        jest.clearAllMocks();
        mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };
        mongoose_1.default.startSession.mockResolvedValue(mockSession);
    });
    describe("loginOrCreateAccountService", () => {
        it("should create a new user if not exists", async () => {
            const fakeUser = { _id: "user1", save: jest.fn(), currentWorkspace: null };
            const fakeWorkspace = { _id: "ws1", save: jest.fn() };
            const fakeRole = { _id: "role1" };
            user_model_1.default.findOne.mockImplementation(() => ({
                session: jest.fn().mockResolvedValue(null),
            }));
            user_model_1.default.mockImplementation(() => fakeUser);
            account_model_1.default.mockImplementation(() => ({ save: jest.fn() }));
            workspace_model_1.default.mockImplementation(() => fakeWorkspace);
            roles_permission_model_1.default.findOne.mockImplementation(() => ({
                session: jest.fn().mockResolvedValue(fakeRole),
            }));
            member_model_1.default.mockImplementation(() => ({ save: jest.fn() }));
            const result = await (0, auth_service_1.loginOrCreateAccountService)({
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
            const fakeUser = {
                _id: "user1",
                comparePassword: jest.fn().mockResolvedValue(true),
                omitPassword: jest.fn().mockReturnValue({ _id: "user1" }),
            };
            account_model_1.default.findOne.mockResolvedValue({ userId: "user1" });
            user_model_1.default.findById.mockResolvedValue(fakeUser);
            const result = await (0, auth_service_1.verifyUserService)({ email: "test@test.com", password: "123" });
            expect(result._id).toBe("user1");
        });
        it("should throw NotFoundException if account not found", async () => {
            account_model_1.default.findOne.mockResolvedValue(null);
            await expect((0, auth_service_1.verifyUserService)({ email: "noone@test.com", password: "123" })).rejects.toThrow(appError_1.NotFoundException);
        });
        it("should throw UnauthorizedException if password wrong", async () => {
            const fakeUser = {
                comparePassword: jest.fn().mockResolvedValue(false),
                omitPassword: jest.fn(),
            };
            account_model_1.default.findOne.mockResolvedValue({ userId: "user1" });
            user_model_1.default.findById.mockResolvedValue(fakeUser);
            await expect((0, auth_service_1.verifyUserService)({ email: "test@test.com", password: "wrong" })).rejects.toThrow(appError_1.UnauthorizedException);
        });
    });
    describe("findUserByIdService", () => {
        it("should return user if found", async () => {
            const fakeUser = { _id: "user1", email: "test@test.com" };
            user_model_1.default.findById.mockResolvedValue(fakeUser);
            const result = await (0, auth_service_1.findUserByIdService)("user1");
            expect(result).toEqual(fakeUser);
        });
        it("should return null if not found", async () => {
            user_model_1.default.findById.mockResolvedValue(null);
            const result = await (0, auth_service_1.findUserByIdService)("noone");
            expect(result).toBeNull();
        });
    });
});
