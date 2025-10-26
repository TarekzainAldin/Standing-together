export declare const getMemberRoleInWorkspace: (userId: string, workspaceId: string) => Promise<{
    role: "OWNER" | "ADMIN" | "MEMBER";
}>;
export declare const joinWorkspaceByInviteService: (userId: string, inviteCode: string) => Promise<{
    workspaceId: unknown;
    role: "OWNER" | "ADMIN" | "MEMBER";
}>;
//# sourceMappingURL=member.service.d.ts.map