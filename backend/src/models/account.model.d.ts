import mongoose, { Document } from "mongoose";
import { ProviderEnumType } from "../enums/account-provider.enum";
export interface AccountDocument extends Document {
    provider: ProviderEnumType;
    providerId: string;
    userId: mongoose.Types.ObjectId;
    refreshToken?: string | null;
    tokenExpiry: Date | null;
    createdAt: Date;
}
declare const AccountModel: mongoose.Model<AccountDocument, {}, {}, {}, mongoose.Document<unknown, {}, AccountDocument, {}, {}> & AccountDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default AccountModel;
//# sourceMappingURL=account.model.d.ts.map