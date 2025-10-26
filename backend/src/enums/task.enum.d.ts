export declare const TaskStatusEnum: {
    readonly BACKLOG: "BACKLOG";
    readonly TODO: "TODO";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly IN_REVIEW: "IN_REVIEW";
    readonly DONE: "DONE";
};
export declare const TaskPriorityEnum: {
    readonly LOW: "LOW";
    readonly MEDIUM: "MEDIUM";
    readonly HIGH: "HIGH";
    readonly UrGENT: "URGENT";
};
export type TaskStatusEnumType = keyof typeof TaskStatusEnum;
export type TaskPriorityEnumType = keyof typeof TaskPriorityEnum;
//# sourceMappingURL=task.enum.d.ts.map