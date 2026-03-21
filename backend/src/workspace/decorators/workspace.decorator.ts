import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { WorkspaceContextPayload } from "../types/workspace-context.type";

// Lấy toàn bộ context (workspace + membership + permissions)
export const WorkspaceContext = createParamDecorator(
    (_data: unknown, context: ExecutionContext): WorkspaceContextPayload => {
        const request = context.switchToHttp().getRequest();
        if (!request.workspaceContext) {
            throw new Error('Workspace context not found. Ensure WorkspaceContextMiddleware is used.'); // Lỗi lập trình, không phải lỗi user → throw Error thường, không phải HttpException
        }
        return request.workspaceContext;
    }
);

// Decorator riêng để lấy workspace ID (đã validate)
export const WorkspaceId = createParamDecorator(
    (_data: unknown, context: ExecutionContext): string => {
        const request = context.switchToHttp().getRequest();
        if (!request.workspaceContext) {
            throw new Error('Workspace context not found. Ensure WorkspaceContextMiddleware is used.');
        }
        return request.workspaceContext.workspace.id;
    }
);