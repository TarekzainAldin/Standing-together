export declare const Roles: {
    readonly OWNER: "OWNER";
    readonly ADMIN: "ADMIN";
    readonly MEMBER: "MEMBER";
};
export type RoleType = keyof typeof Roles;
export declare const Permissions: {
    readonly CREATE_WORKSPACE: "CREATE_WORKSPACE";
    readonly DELETE_WORKSPACE: "DELETE_WORKSPACE";
    readonly EDIT_WORKSPACE: "EDIT_WORKSPACE";
    readonly MANAGE_WORKSPACE_SETTINGS: "MANAGE_WORKSPACE_SETTINGS";
    readonly ADD_MEMBER: "ADD_MEMBER";
    readonly CHANGE_MEMBER_ROLE: "CHANGE_MEMBER_ROLE";
    readonly REMOVE_MEMBER: "REMOVE_MEMBER";
    readonly CREATE_PROJECT: "CREATE_PROJECT";
    readonly EDIT_PROJECT: "EDIT_PROJECT";
    readonly DELETE_PROJECT: "DELETE_PROJECT";
    readonly CREATE_TASK: "CREATE_TASK";
    readonly EDIT_TASK: "EDIT_TASK";
    readonly DELETE_TASK: "DELETE_TASK";
    readonly VIEW_ONLY: "VIEW_ONLY";
};
export type PermissionType = keyof typeof Permissions;
//# sourceMappingURL=role.enum.d.ts.map