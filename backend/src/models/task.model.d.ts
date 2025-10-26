import mongoose, { Document } from "mongoose";
import { TaskPriorityEnumType, TaskStatusEnumType } from "../enums/task.enum";
export interface TaskDocument extends Document {
    taskCode: string;
    title: string;
    description: string | null;
    project: mongoose.Types.ObjectId;
    workspace: mongoose.Types.ObjectId;
    status: TaskStatusEnumType;
    priority: TaskPriorityEnumType;
    assignedTo: mongoose.Types.ObjectId | null;
    createdBy: mongoose.Types.ObjectId;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
declare const TaskModel: mongoose.Model<TaskDocument, {}, {}, {}, mongoose.Document<unknown, {}, TaskDocument, {}, {}> & TaskDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default TaskModel;
//# sourceMappingURL=task.model.d.ts.map