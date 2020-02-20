import { IsEmail, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class  UsuariosCreateDto {
    @IsNotEmpty()
    @IsEmail()
    correo: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(256)
    password: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    idRol: number;
}
