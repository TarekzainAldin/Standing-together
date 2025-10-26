import { NextFunction, Request, Response } from "express";
type AyncControllerType = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const asyncHandler: (controller: AyncControllerType) => AyncControllerType;
export {};
//# sourceMappingURL=asyncHandler.middleware.d.ts.map