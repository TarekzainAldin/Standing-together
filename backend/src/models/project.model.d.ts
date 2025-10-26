import mongoose, { Document } from "mongoose";
export interface ProjectDocument extends Document {
    name: string;
    description: string | null;
    emoji: string;
    workspace: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const ProjectModel: mongoose.Model<ProjectDocument, {}, {}, {}, mongoose.Document<unknown, {}, ProjectDocument, {}, {}> & ProjectDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default ProjectModel;
//# sourceMappingURL=project.model.d.ts.map