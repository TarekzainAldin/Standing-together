import { z } from "zod";
export declare const titleSchema: z.ZodString;
export declare const descriptionSchema: z.ZodOptional<z.ZodString>;
export declare const assignedToSchema: z.ZodOptional<z.ZodNullable<z.ZodString>>;
export declare const prioritySchema: z.ZodEnum<[string, ...string[]]>;
export declare const statusSchema: z.ZodEnum<[string, ...string[]]>;
export declare const dueDateSchema: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
export declare const taskIdSchema: z.ZodString;
export declare const createTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodEnum<[string, ...string[]]>;
    status: z.ZodEnum<[string, ...string[]]>;
    assignedTo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dueDate: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
}, "strip", z.ZodTypeAny, {
    status: string;
    title: string;
    priority: string;
    description?: string | undefined;
    assignedTo?: string | null | undefined;
    dueDate?: string | undefined;
}, {
    status: string;
    title: string;
    priority: string;
    description?: string | undefined;
    assignedTo?: string | null | undefined;
    dueDate?: string | undefined;
}>;
export declare const updateTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodEnum<[string, ...string[]]>;
    status: z.ZodEnum<[string, ...string[]]>;
    assignedTo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dueDate: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
}, "strip", z.ZodTypeAny, {
    status: string;
    title: string;
    priority: string;
    description?: string | undefined;
    assignedTo?: string | null | undefined;
    dueDate?: string | undefined;
}, {
    status: string;
    title: string;
    priority: string;
    description?: string | undefined;
    assignedTo?: string | null | undefined;
    dueDate?: string | undefined;
}>;
//# sourceMappingURL=task.validation.d.ts.map