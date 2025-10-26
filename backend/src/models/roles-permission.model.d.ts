import mongoose, { Document } from "mongoose";
import { PermissionType, RoleType } from "../enums/role.enum";
export interface RoleDocument extends Document {
    name: RoleType;
    permissions: Array<PermissionType>;
}
declare const RoleModel: mongoose.Model<RoleDocument, {}, {}, {}, mongoose.Document<unknown, {}, RoleDocument, {}, {}> & RoleDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default RoleModel;
//# sourceMappingURL=roles-permission.model.d.ts.map