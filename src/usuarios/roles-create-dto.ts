import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class RolesCreateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  rol: string;
}
