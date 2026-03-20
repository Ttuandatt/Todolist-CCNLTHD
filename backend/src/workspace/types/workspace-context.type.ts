import { Workspace, WorkspaceMember } from "@prisma/client"; // Lấy type từ Prisma luôn — nếu schema đổi thì type tự cập nhật

export type WorkspaceRole = WorkspaceMember['role'];

export interface WorkspacePermissions {
    canManageMembers: boolean; // Thêm/đuổi/thăng chức member
    canInvite: boolean; // Gửi invite
    canArchive: boolean; // Archive workspace
    canDelete: boolean; // Xóa workspace
}

export interface WorkspaceContextPayload {
    workspace: Workspace; // Record workspace - Controller khỏi query lại
    membership: WorkspaceMember; // Membership hiện tại của user trong workspace (null = chưa join)
    permissions: WorkspacePermissions; // Quyền hạn của user trong workspace
}