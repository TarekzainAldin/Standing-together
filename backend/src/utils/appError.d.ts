import { HttpStatusCodeType } from "../config/http.config";
import { ErrorCodeEnumType } from "../enums/error-code.enum";
export declare class AppError extends Error {
    statusCode: HttpStatusCodeType;
    errorCode?: ErrorCodeEnumType | undefined;
    constructor(message: string, statusCode?: number, errorCode?: ErrorCodeEnumType);
}
export declare class HttpException extends AppError {
    constructor(message: string | undefined, statusCode: HttpStatusCodeType, errorCode?: ErrorCodeEnumType);
}
export declare class InternalServerException extends AppError {
    constructor(message?: string, errorCode?: ErrorCodeEnumType);
}
export declare class NotFoundException extends AppError {
    constructor(message?: string, errorCode?: ErrorCodeEnumType);
}
export declare class BadRequestException extends AppError {
    constructor(message?: string, errorCode?: ErrorCodeEnumType);
}
export declare class UnauthorizedException extends AppError {
    constructor(message?: string, errorCode?: ErrorCodeEnumType);
}
//# sourceMappingURL=appError.d.ts.map