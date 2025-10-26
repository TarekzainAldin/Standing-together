"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const user_service_1 = require("../../services/user.service");
const appError_1 = require("../../utils/appError");
// Mock Mongoose Model
jest.mock("../../models/user.model");
describe("User Services", () => {
    const userId = new mongoose_1.default.Types.ObjectId().toString();
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("getCurrentUserService - should return user", async () => {
        const fakeUser = {
            _id: userId,
            name: "John Doe",
            email: "john@example.com",
            currentWorkspace: { _id: "workspace1", name: "Workspace 1" },
        };
        user_model_1.default.findById.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue(fakeUser),
        });
        const result = await (0, user_service_1.getCurrentUserService)(userId);
        expect(result.user).toEqual(fakeUser);
        expect(user_model_1.default.findById).toHaveBeenCalledWith(userId);
    });
    it("getCurrentUserService - should throw if user not found", async () => {
        user_model_1.default.findById.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue(null),
        });
        await expect((0, user_service_1.getCurrentUserService)(userId)).rejects.toThrow(appError_1.BadRequestException);
    });
});
//# sourceMappingURL=user.service.test.js.map