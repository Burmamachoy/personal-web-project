import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class RolesUpdateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  rol: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  id: number;
}
