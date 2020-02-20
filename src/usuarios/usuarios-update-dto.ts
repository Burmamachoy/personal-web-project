import {IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, Min} from "class-validator";

export class  UsuariosUpdateDto {
    @IsNotEmpty()
    @IsEmail()
    correo: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(256)
    password: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    idRol: number;
}
