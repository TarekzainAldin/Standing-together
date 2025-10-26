import { z } from "zod";
export declare const emojiSchema: z.ZodOptional<z.ZodString>;
export declare const nameSchema: z.ZodString;
export declare const descriptionSchema: z.ZodOptional<z.ZodString>;
export declare const projectIdSchema: z.ZodString;
export declare const createProjectSchema: z.ZodObject<{
    emoji: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    emoji?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    emoji?: string | undefined;
}>;
export declare const updateProjectSchema: z.ZodObject<{
    emoji: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    emoji?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    emoji?: string | undefined;
}>;
//# sourceMappingURL=project.validation.d.ts.map