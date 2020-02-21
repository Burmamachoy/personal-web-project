import {IsDecimal, IsInt, IsNotEmpty, Min} from "class-validator";

export class DetalleCarritoCreateDto{

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    cantidad: number;

    @IsNotEmpty()
    @IsInt()
    idAnime: number;

}
