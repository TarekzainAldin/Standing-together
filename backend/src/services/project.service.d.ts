import mongoose from "mongoose";
export declare const createProjectService: (userId: string, workspaceId: string, body: {
    emoji?: string | undefined;
    name: string;
    description?: string | undefined;
}) => Promise<{
    project: mongoose.Document<unknown, {}, import("../models/project.model").ProjectDocument, {}, {}> & import("../models/project.model").ProjectDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    };
}>;
export declare const getProjectsInWorkspaceService: (workspaceId: string, pageSize: number, pageNumber: number) => Promise<{
    projects: (mongoose.Document<unknown, {}, import("../models/project.model").ProjectDocument, {}, {}> & import("../models/project.model").ProjectDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[];
    totalCount: number;
    totalPages: number;
    skip: number;
}>;
export declare const getProjectByIdAndWorkspaceIdService: (workspaceId: string, projectId: string) => Promise<{
    project: mongoose.Document<unknown, {}, import("../models/project.model").ProjectDocument, {}, {}> & import("../models/project.model").ProjectDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    };
}>;
export declare const getProjectAnalyticsService: (workspaceId: string, projectId: string) => Promise<{
    analytics: {
        totalTasks: any;
        overdueTasks: any;
        completedTasks: any;
    };
}>;
export declare const updateProjectService: (workspaceId: string, projectId: string, body: {
    emoji?: string | undefined;
    name?: string;
    description?: string | undefined;
}) => Promise<{
    project: mongoose.Document<unknown, {}, import("../models/project.model").ProjectDocument, {}, {}> & import("../models/project.model").ProjectDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    };
}>;
export declare const deleteProjectService: (workspaceId: string, projectId: string) => Promise<mongoose.Document<unknown, {}, import("../models/project.model").ProjectDocument, {}, {}> & import("../models/project.model").ProjectDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
//# sourceMappingURL=project.service.d.ts.map