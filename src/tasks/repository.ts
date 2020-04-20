import { Repository, EntityRepository } from 'typeorm';
import { Task } from './entity';
import { TaskStatus } from './status.enum';
import { CreateTaskDto } from './dto/create-task';
import { GetTasksFilterDto } from './dto/get-tasks-filter';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
   async getTasks(filterDto: GetTasksFilterDto) : Promise<Task[]> {
      const {status, search} = filterDto;
      const queryBuilder = this.createQueryBuilder('task')
      if(status) {
         queryBuilder.andWhere('task.status = :status', {status: `%${search}%`});
      }
      if(search) {
         queryBuilder.andWhere('task.title LIKE :search OR task.description LIKE :search', {search});
      }
      const tasks = await queryBuilder.getMany()
      return tasks;
   }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  }
}
