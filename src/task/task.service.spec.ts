import { Test } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter';
import { TaskStatus } from './task.status.enum';
import { User } from 'src/auth/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task';
import { Task } from './task.entity';

const mockTaskRepository = () => ({
   getTasks: jest.fn(),
   findOne: jest.fn(),
   createTask: jest.fn(),
   delete: jest.fn()
})

const mockUser= {username: 'test-user', id: 3} as User;

describe('TaskService', () => {
   let taskService: TaskService;
   let taskRepository;
   beforeEach(async () =>{
      const module =  await Test.createTestingModule({
         providers: [ TaskService, {provide: TaskRepository, useFactory: mockTaskRepository}],

      }).compile()
      taskService = await module.get<TaskService>(TaskService)
      taskRepository = await module.get<TaskRepository>(TaskRepository);
   });

   describe('getTasks', () => {
      it('get all tasks from repository', async () => {
         const value = 42;
         taskRepository.getTasks.mockResolvedValue(value);

         expect(taskRepository.getTasks).not.toBeCalled();
         const filters: GetTasksFilterDto = {status: TaskStatus.IN_PROGRESS, search: "filter"}
         const result = await taskService.getTasks(filters, mockUser);
         expect(taskRepository.getTasks).toHaveBeenCalled();
         expect(result).toBe(value);

      });
   });

   describe('getTaskId', () => {
      it('calls taskResository.findOne and succesfully',  async () => {
         const mockTask = {title: 'Test task', description: 'test task'}
         taskRepository.findOne.mockResolvedValue(mockTask);
         const result = await taskService.getTaskById(1, mockUser);
         expect(result).toEqual(mockTask);
         expect(taskRepository.findOne).toBeCalledWith({
            where: {
               id: 1,
               userId: mockUser.id
            }
         });
      });

      it('throws an error as task is not found', () => {
         taskRepository.findOne.mockResolvedValue(null);
         expect(taskService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
      });
   })

   describe('createTask', () => {
      it('create task', async () => {
         const createTaskDto: CreateTaskDto = {title: "test task", description: "description test"};
         const value = 'dummy';
         taskRepository.createTask.mockResolvedValue(value);
         const result = await taskService.createTask(createTaskDto, mockUser);
         expect(result).toEqual(value);
         expect(taskRepository.createTask).toBeCalledWith(createTaskDto, mockUser);
      });
   });

   describe('deleteTask', () => {
      it('delete task', async () => {
         const value = {affected: 42};
         taskRepository.delete.mockResolvedValue(value);
         await taskService.deleteTask(1, mockUser);
         expect(taskRepository.delete).toBeCalledWith({id: 1, userId: mockUser.id});
      });

      it('throw when try to delete task', async() => {
         const value = {affected: 0};
         taskRepository.delete.mockResolvedValue(value);
         expect(taskService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
      });
   });

   describe('updateTaskStatus', () => {
      it('update the task status', async () => {
         const save = jest.fn().mockResolvedValue(true)
         const mockTask = { id: 1,save , status: TaskStatus.OPEN};
         taskRepository.findOne.mockResolvedValue(mockTask);
         expect(save).not.toHaveBeenCalled();
         const result = await taskService.updateTaskStatus(mockTask.id, TaskStatus.DONE, mockUser);
         mockTask.status = TaskStatus.DONE;
         expect(result).toEqual(mockTask);
         expect(taskRepository.findOne).toBeCalledWith({where: {id: mockTask.id, userId: mockUser.id}})
         expect(save).toHaveBeenCalled();

      });
   })
})
