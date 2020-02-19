import {IsEmail, IsNotEmpty, IsString, MaxLength} from "class-validator";

export class  UsuariosCreateDto {
    @IsNotEmpty()
    @IsEmail()
    correo: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(256)
    password: string;
}
