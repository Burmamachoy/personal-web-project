import {IsNotEmpty, IsString, MaxLength} from "class-validator";

export class generosCreateDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(32)
    nombre: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(256)
    descripcion: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(32)
    publicoPrincipal: string;
}
