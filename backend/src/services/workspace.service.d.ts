import mongoose from "mongoose";
export declare const createWorkspaceService: (userId: string, body: {
    name: string;
    description?: string | undefined;
}) => Promise<{
    workspace: mongoose.Document<unknown, {}, import("../models/workspace.model").WorkspaceDocument, {}, {}> & import("../models/workspace.model").WorkspaceDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    };
}>;
export declare const getAllWorkspacesUserIsMemberService: (userId: string) => Promise<{
    workspaces: mongoose.Types.ObjectId[];
}>;
export declare const getWorkspaceByIdService: (workspaceId: string) => Promise<{
    workspace: {
        members: (mongoose.Document<unknown, {}, import("../models/member.model").MemberDocument, {}, {}> & import("../models/member.model").MemberDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        name: string;
        description: string;
        owner: mongoose.Types.ObjectId;
        inviteCode: string;
        createdAt: string;
        updatedAt: string;
        _id: unknown;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: mongoose.Collection;
        db: mongoose.Connection;
        errors?: mongoose.Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: mongoose.Schema;
        __v: number;
    };
}>;
export declare const getWorkspaceMembersService: (workspaceId: string) => Promise<{
    members: (mongoose.Document<unknown, {}, import("../models/member.model").MemberDocument, {}, {}> & import("../models/member.model").MemberDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[];
    roles: (mongoose.FlattenMaps<import("../models/roles-permission.model").RoleDocument> & Required<{
        _id: mongoose.FlattenMaps<unknown>;
    }> & {
        __v: number;
    })[];
}>;
export declare const changeMemberRoleService: (workspaceId: string, memberId: string, roleId: string) => Promise<{
    member: mongoose.Document<unknown, {}, import("../models/member.model").MemberDocument, {}, {}> & import("../models/member.model").MemberDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    };
}>;
export declare const getWorkspaceAnalyticsService: (workspaceId: string) => Promise<{
    analytics: {
        totalTasks: number;
        overdueTasks: number;
        completedTasks: number;
    };
}>;
export declare const updateWorkspaceByIdService: (workspaceId: string, name: string, description?: string) => Promise<{
    workspace: mongoose.Document<unknown, {}, import("../models/workspace.model").WorkspaceDocument, {}, {}> & import("../models/workspace.model").WorkspaceDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    };
}>;
export declare const deleteWorkspaceService: (workspaceId: string, userId: string) => Promise<{
    currentWorkspace: mongoose.Types.ObjectId | null;
}>;
//# sourceMappingURL=workspace.service.d.ts.map