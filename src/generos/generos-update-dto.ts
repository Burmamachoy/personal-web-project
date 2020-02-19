import {IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min} from "class-validator";

export class GenerosUpdateDto {
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

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    id: number;
}
