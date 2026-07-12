import { IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator"


export class CreateTramitDto {

    @IsString()
    @IsNotEmpty()
    name!: string

    @IsString()
    description!: string

    @IsUUID()
    @IsString()
    @IsNotEmpty()
    room!: string

}
