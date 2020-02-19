import {IsInt, IsNotEmpty, IsString, MaxLength, Min} from "class-validator";

export class animesCreateDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(32)
    nombre: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    anioLanzamiento: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(32)
    estudio: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    numeroEpisodios: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(32)
    director: string;
}
