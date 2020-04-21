import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';
import { CreateTaskDto } from './dto/create-task';
import { GetTasksFilterDto } from './dto/get-tasks-filter';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto, user:User): Promise<Task[]> {
    const { status, search } = filterDto;
    const queryBuilder = this.createQueryBuilder('task');
    queryBuilder.where('task.userId = :userId', {userId: user.id});
    if (status) {
      queryBuilder.andWhere('task.status = :status', {status});
    }
    if (search) {
      queryBuilder.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    const tasks = await queryBuilder.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user : User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    delete task.user;
    return task;
  }
}
