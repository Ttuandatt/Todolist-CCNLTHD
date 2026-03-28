import { registerAs } from "@nestjs/config"; // registerAs cho phép gom nhóm config dưới 1 key trong ConfigService.

export interface WorkspaceLimitConfig {
    maxWorkspacePerUser: number; // Limit số lượng workspace tối đa mỗi user 
    maxMemberPerworkspace: number; // Limit số lượng thành viên tối đa mỗi workspace
    inviteExpiryDays: number; // Thời gian tồn tại của invite link (ngày)    
}

