import mongoose from "mongoose";
import UserModel from "../../models/user.model";
import { getCurrentUserService } from "../../services/user.service";
import { BadRequestException } from "../../utils/appError";

// Mock Mongoose Model
jest.mock("../../models/user.model");

describe("User Services", () => {
  const userId = new mongoose.Types.ObjectId().toString();

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

    (UserModel.findById as any).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(fakeUser),
    });

    const result = await getCurrentUserService(userId);

    expect(result.user).toEqual(fakeUser);
    expect(UserModel.findById).toHaveBeenCalledWith(userId);
  });

  it("getCurrentUserService - should throw if user not found", async () => {
    (UserModel.findById as any).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(getCurrentUserService(userId)).rejects.toThrow(
      BadRequestException
    );
  });
});
