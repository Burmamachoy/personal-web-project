import {IsNotEmpty, MaxLength} from "class-validator";

export class CabeceraCarritoCreateDto{

    @IsNotEmpty()
    @MaxLength(128)
    direccion: string;

}
