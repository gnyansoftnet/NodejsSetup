
export interface RolePermissionUpdateDto {
    rolePermissionId: number;
    canRead: boolean;
    canWrite: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}