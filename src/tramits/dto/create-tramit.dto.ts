import { IsNotEmpty, IsString, MinLength } from "class-validator"


export class CreateTramitDto {

    @IsString()
    @IsNotEmpty()
    name!: string

    @IsString()
    description!: string

}
