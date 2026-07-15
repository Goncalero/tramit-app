

import { Type } from "class-transformer"
import { IsOptional, IsPositive, Min } from "class-validator"



/*
    ESTO SIRVE PARA LA PAGINACIÓN, PARA QUE ME MUESTRE EN VEZ
    DE TODOS LOS RESULTADOS, QUE SOLO ME MUESTRE LOS 5 PRIMEROS
    POR EJEMPLO.
    COMO EN LA API DE POKEMON HAY 300 POKEMON, SI LE DECIMOS QUE
    NOS MUESTRE TODOS, SERÍA UNA LOCURA EN LA PÁGINA, CON LO
    CUAL LE DECIMOS QUE NOS MUESTRE LOS 10 PRIMEROS Y YA ESTÁ
    
    Y EL OFFSET SE SALTA EL NÚMERO DE REGISTROS DE LA CONSULTA
    QUE LE DIGAMOS, SI PONEMOS 2, SE SALTARÁ LOS 2 PRIMEROS
*/

export class PaginationDto{

    @IsOptional()
    @IsPositive()
    @Type( () => Number )
    limit?: number

    @IsOptional()
    @Min(0)
    @Type( () => Number )
    offset?: number
}