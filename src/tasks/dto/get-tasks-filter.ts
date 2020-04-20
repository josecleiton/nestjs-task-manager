import { IsNotEmpty, IsOptional } from "class-validator";
import { TaskStatus } from "../status.enum";

export class GetTasksFilterDto {
   @IsOptional()
   status: TaskStatus;

   @IsOptional()
   @IsNotEmpty()
   search: string;
}
