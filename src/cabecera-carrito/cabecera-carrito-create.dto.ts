import {IsNotEmpty, IsString, MaxLength} from "class-validator";

export class CabeceraCarritoCreateDto{

    @IsNotEmpty()
    direccion: string;

}
