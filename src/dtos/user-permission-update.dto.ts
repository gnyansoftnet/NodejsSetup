
export interface UserPermissionUpdateDto {
    userPermissionId: number;
    canRead: boolean;
    canWrite: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}