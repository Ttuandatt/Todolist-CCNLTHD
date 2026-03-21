import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Chỉnh đường dẫn cho đúng
import { CurrentUser } from '../../auth/decorators/current-user.decorator'; // Chỉnh đường dẫn cho đúng

@Controller('workspaces')
@UseGuards(JwtAuthGuard) // Yêu cầu phải có token đăng nhập cho MỌI endpoint ở đây
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.create(userId, createWorkspaceDto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.workspaceService.findAllForUser(userId);
  }

  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id') workspaceId: string) {
    return this.workspaceService.remove(userId, workspaceId);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') workspaceId: string) {
    return this.workspaceService.findOne(userId, workspaceId);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') workspaceId: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(userId, workspaceId, updateWorkspaceDto);
  }

  @Post(':id/invite')
  createInvite(
    @CurrentUser('id') userId: string,
    @Param('id') workspaceId: string,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    return this.workspaceService.createInvite(userId, workspaceId, inviteMemberDto);
  }

  @Post('accept-invite/:token')
  acceptInvite(
    @CurrentUser('id') userId: string,
    @Param('token') token: string,
  ) {
    return this.workspaceService.acceptInvite(userId, token);
  }

  @Get(':id/members')
  getMembers(@CurrentUser('id') userId: string, @Param('id') workspaceId: string) {
    return this.workspaceService.getMembers(userId, workspaceId);
  }

  @Patch(':id/members/:userId')
  changeMemberRole(
    @CurrentUser('id') userId: string,
    @Param('id') workspaceId: string,
    @Param('userId') memberId: string,
    @Body() changeRoleDto: ChangeRoleDto,
  ) {
    return this.workspaceService.changeMemberRole(userId, workspaceId, memberId, changeRoleDto);
  }

  @Delete(':id/members/:userId')
  removeMember(
    @CurrentUser('id') userId: string,
    @Param('id') workspaceId: string,
    @Param('userId') memberId: string,
  ) {
    return this.workspaceService.removeMember(userId, workspaceId, memberId);
  }

  @Delete(':id/leave')
  leaveWorkspace(
    @CurrentUser('id') userId: string,
    @Param('id') workspaceId: string,
  ) {
    return this.workspaceService.leaveWorkspace(userId, workspaceId);
  }
}
