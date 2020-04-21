import { MaxLength, MinLength, IsString } from 'class-validator';
import { SignInDto } from './signin.dto';

export class SignUpDto extends SignInDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;
}
