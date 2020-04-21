import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
  Param,
  Get,
  ParseIntPipe,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task.status.enum';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  async getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User
  ): Promise<Task[]> {
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  async getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(@GetUser() user: User, @Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Put(':id/status')
  async updateTaskState(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status, user);
  }

  @Delete()
  async deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    return this.taskService.deleteTask(id, user);
  }

}
