import mongoose, { Document } from "mongoose";
import { RoleDocument } from "./roles-permission.model";
export interface MemberDocument extends Document {
    userId: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    role: RoleDocument;
    joinedAt: Date;
}
declare const MemberModel: mongoose.Model<MemberDocument, {}, {}, {}, mongoose.Document<unknown, {}, MemberDocument, {}, {}> & MemberDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default MemberModel;
//# sourceMappingURL=member.model.d.ts.map