export declare const createTaskService: (workspaceId: string, projectId: string, userId: string, body: {
    title: string;
    description?: string | undefined;
    priority: string;
    status?: string | undefined;
    assignedTo?: string | null | undefined;
    dueDate?: string | undefined;
}) => Promise<{
    task: import("mongoose").Document<unknown, {}, import("../models/task.model").TaskDocument, {}, {}> & import("../models/task.model").TaskDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    };
}>;
export declare const updateTaskService: (workspaceId: string, projectId: string, taskId: string, body: {
    title: string;
    description?: string | undefined;
    priority: string;
    status?: string | undefined;
    assignedTo?: string | null | undefined;
    dueDate?: string | undefined;
}) => Promise<{
    updatedTask: import("mongoose").Document<unknown, {}, import("../models/task.model").TaskDocument, {}, {}> & import("../models/task.model").TaskDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    };
}>;
export declare const getAllTasksService: (workspaceId: string, filters: {
    projectId?: string | undefined;
    status?: string[] | undefined;
    priority?: string[] | undefined;
    assignedTo?: string[] | undefined;
    keyword?: string | undefined;
    dueDate?: string | undefined;
}, pagination: {
    pageSize: number;
    pageNumber: number;
}) => Promise<{
    tasks: (import("mongoose").Document<unknown, {}, import("../models/task.model").TaskDocument, {}, {}> & import("../models/task.model").TaskDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[];
    pagination: {
        pageSize: number;
        pageNumber: number;
        totalCount: number;
        totalPages: number;
        skip: number;
    };
}>;
export declare const getTaskByIdService: (workspaceId: string, projectId: string, taskId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/task.model").TaskDocument, {}, {}> & import("../models/task.model").TaskDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const deleteTaskService: (workspaceId: string, taskId: string) => Promise<void>;
//# sourceMappingURL=task.service.d.ts.map