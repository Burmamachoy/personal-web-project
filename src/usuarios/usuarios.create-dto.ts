import {IsEmail, IsNotEmpty, IsString, MaxLength} from "class-validator";

export class  usuariosCreateDto {
    @IsNotEmpty()
    @IsEmail()
    correo: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(256)
    password: string;
}
