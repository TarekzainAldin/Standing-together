import mongoose from "mongoose";
export declare const loginOrCreateAccountService: (data: {
    provider: string;
    displayName: string;
    providerId: string;
    picture?: string;
    email?: string;
}) => Promise<{
    user: mongoose.Document<unknown, {}, import("../models/user.model").UserDocument, {}, {}> & import("../models/user.model").UserDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    };
}>;
export declare const registerUserService: (body: {
    email: string;
    name: string;
    password: string;
}) => Promise<{
    userId: unknown;
    workspaceId: unknown;
}>;
export declare const verifyUserService: ({ email, password, provider, }: {
    email: string;
    password: string;
    provider?: string;
}) => Promise<Omit<import("../models/user.model").UserDocument, "password">>;
export declare const findUserByIdService: (userId: string) => Promise<(mongoose.Document<unknown, {}, import("../models/user.model").UserDocument, {}, {}> & import("../models/user.model").UserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}) | null>;
//# sourceMappingURL=auth.service.d.ts.map