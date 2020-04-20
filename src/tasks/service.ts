import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entity';
import { CreateTaskDto } from './dto/create-task';
import { TaskStatus } from './status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto) {
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with id #${id} not found.`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Task with id #${id} not found.`);
    }
  }
}