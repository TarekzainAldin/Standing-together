import { Request, Response, NextFunction } from "express";
/**
 * يسمح فقط للـ Owner أو Admin (لو موجود) بإنشاء التقارير
 */
export declare const authorizeReportGeneration: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authorize.middleware.d.ts.map