import { SignOptions } from "jsonwebtoken";
import { UserDocument } from "../models/user.model";
export type AccessTPayload = {
    userId: UserDocument["_id"];
};
type SignOptsAndSecret = SignOptions & {
    secret: string;
};
export declare const accessTokenSignOptions: SignOptsAndSecret;
export declare const signJwtToken: (payload: AccessTPayload, options?: SignOptsAndSecret) => string;
export {};
//# sourceMappingURL=jwt.d.ts.map