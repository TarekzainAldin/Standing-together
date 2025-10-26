import { z } from "zod";
export declare const nameSchema: z.ZodString;
export declare const descriptionSchema: z.ZodOptional<z.ZodString>;
export declare const workspaceIdSchema: z.ZodString;
export declare const changeRoleSchema: z.ZodObject<{
    roleId: z.ZodString;
    memberId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    roleId: string;
    memberId: string;
}, {
    roleId: string;
    memberId: string;
}>;
export declare const createWorkspaceSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
}>;
export declare const updateWorkspaceSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
}>;
//# sourceMappingURL=workspace.valdation.d.ts.map