import { PermissionType } from "../enums/role.enum";
import { RolePermissions } from "./role-permission";
export declare const roleGuard: (role: keyof typeof RolePermissions, requiredPermissions: PermissionType[]) => void;
//# sourceMappingURL=roleGuard.d.ts.map