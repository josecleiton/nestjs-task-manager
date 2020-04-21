import { PipeTransform, BadRequestException } from '@nestjs/common';

import { TaskStatus } from '../task.status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  transform(value: string) {
    value = value.toUpperCase();
    if (!(value in TaskStatus)) {
      throw new BadRequestException(`Invalid status: ${value}`);
    }
    return value;
  }
}
