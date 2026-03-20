import { WorkspaceContextPayload } from "src/workspace/types/workspace-context.type";

declare module 'express-serve-static-core' {
    interface Request {
        workspaceContext?: WorkspaceContextPayload; // TypeScript mặc định không biết request.workspaceContext. Dòng này "dạy" TypeScript: "ê, request có thêm field này nha"
    }
}