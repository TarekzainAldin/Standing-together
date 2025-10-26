import mongoose, { Document } from "mongoose";
export interface WorkspaceDocument extends Document {
    name: string;
    description: string;
    owner: mongoose.Types.ObjectId;
    inviteCode: string;
    createdAt: string;
    updatedAt: string;
}
declare const WorkspaceModel: mongoose.Model<WorkspaceDocument, {}, {}, {}, mongoose.Document<unknown, {}, WorkspaceDocument, {}, {}> & WorkspaceDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default WorkspaceModel;
//# sourceMappingURL=workspace.model.d.ts.map