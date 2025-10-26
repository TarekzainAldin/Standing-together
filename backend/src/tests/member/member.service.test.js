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
const mongoose_1 = __importDefault(require("mongoose"));
const memberService = __importStar(require("../../services/member.service"));
const member_model_1 = __importDefault(require("../../models/member.model"));
const roles_permission_model_1 = __importDefault(require("../../models/roles-permission.model"));
const workspace_model_1 = __importDefault(require("../../models/workspace.model"));
const role_enum_1 = require("../../enums/role.enum");
const appError_1 = require("../../utils/appError");
// Mock Mongoose Models
jest.mock("../../models/member.model");
jest.mock("../../models/roles-permission.model");
jest.mock("../../models/workspace.model");
describe("Member Services", () => {
    const userId = new mongoose_1.default.Types.ObjectId().toString();
    const workspaceId = new mongoose_1.default.Types.ObjectId().toString();
    const inviteCode = "INV123";
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // ===== getMemberRoleInWorkspace =====
    it("getMemberRoleInWorkspace - should return role", async () => {
        const role = { _id: "role1", name: role_enum_1.Roles.MEMBER };
        member_model_1.default.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue({ role }),
        });
        workspace_model_1.default.findById.mockResolvedValue({ _id: workspaceId });
        const result = await memberService.getMemberRoleInWorkspace(userId, workspaceId);
        expect(result).toEqual({ role: role_enum_1.Roles.MEMBER });
    });
    it("getMemberRoleInWorkspace - should throw if workspace not found", async () => {
        workspace_model_1.default.findById.mockResolvedValue(null);
        await expect(memberService.getMemberRoleInWorkspace(userId, workspaceId)).rejects.toThrow(appError_1.NotFoundException);
    });
    it("getMemberRoleInWorkspace - should throw if member not found", async () => {
        workspace_model_1.default.findById.mockResolvedValue({ _id: workspaceId });
        member_model_1.default.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
        await expect(memberService.getMemberRoleInWorkspace(userId, workspaceId)).rejects.toThrow(appError_1.UnauthorizedException);
    });
    // ===== joinWorkspaceByInviteService =====
    it("joinWorkspaceByInviteService - should add user to workspace", async () => {
        const role = { _id: "role1", name: role_enum_1.Roles.MEMBER };
        const workspace = { _id: workspaceId };
        workspace_model_1.default.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(workspace) });
        member_model_1.default.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
        roles_permission_model_1.default.findOne.mockResolvedValue(role);
        member_model_1.default.prototype.save = jest.fn().mockResolvedValue({});
        const result = await memberService.joinWorkspaceByInviteService(userId, inviteCode);
        expect(result).toEqual({ workspaceId, role: role_enum_1.Roles.MEMBER });
        expect(member_model_1.default.prototype.save).toHaveBeenCalled();
    });
    it("joinWorkspaceByInviteService - should throw if workspace not found", async () => {
        workspace_model_1.default.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
        await expect(memberService.joinWorkspaceByInviteService(userId, inviteCode)).rejects.toThrow(appError_1.NotFoundException);
    });
    it("joinWorkspaceByInviteService - should throw if already a member", async () => {
        const workspace = { _id: workspaceId };
        workspace_model_1.default.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(workspace) });
        member_model_1.default.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue({}) });
        await expect(memberService.joinWorkspaceByInviteService(userId, inviteCode)).rejects.toThrow(appError_1.BadRequestException);
    });
    it("joinWorkspaceByInviteService - should throw if role not found", async () => {
        const workspace = { _id: workspaceId };
        workspace_model_1.default.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(workspace) });
        member_model_1.default.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
        roles_permission_model_1.default.findOne.mockResolvedValue(null);
        await expect(memberService.joinWorkspaceByInviteService(userId, inviteCode)).rejects.toThrow(appError_1.NotFoundException);
    });
});
//# sourceMappingURL=member.service.test.js.map