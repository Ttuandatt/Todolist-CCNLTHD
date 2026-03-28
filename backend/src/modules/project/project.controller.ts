import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // ---- Nested routes: /workspaces/:wsId/projects ----

  @Post('workspaces/:wsId/projects')
  create(
    @CurrentUser('id') userId: string,
    @Param('wsId', ParseUUIDPipe) workspaceId: string,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectService.create(userId, workspaceId, dto);
  }

  @Get('workspaces/:wsId/projects')
  findAll(
    @CurrentUser('id') userId: string,
    @Param('wsId', ParseUUIDPipe) workspaceId: string,
    @Query() query: QueryProjectDto,
  ) {
    return this.projectService.findAllByWorkspace(userId, workspaceId, query);
  }

  // ---- Flat routes: /projects/:id ----

  @Get('projects/:id')
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.projectService.findOne(userId, id);
  }

  @Patch('projects/:id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectService.update(userId, id, dto);
  }

  @Delete('projects/:id')
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.projectService.remove(userId, id);
  }

  @Post('projects/:id/archive')
  @HttpCode(HttpStatus.OK)
  archive(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.projectService.archive(userId, id);
  }

  @Post('projects/:id/unarchive')
  @HttpCode(HttpStatus.OK)
  unarchive(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.projectService.unarchive(userId, id);
  }

  @Post('projects/:id/pin')
  @HttpCode(HttpStatus.OK)
  pin(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.projectService.pin(userId, id);
  }

  @Post('projects/:id/unpin')
  @HttpCode(HttpStatus.OK)
  unpin(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.projectService.unpin(userId, id);
  }
}
