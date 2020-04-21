import { MaxLength, MinLength, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
