import { IsNotEmpty, IsString, MinLength } from "class-validator"


export class CreateRoomDto {

    @IsString()
    @IsNotEmpty()
    name!: string

    @IsString()
    @IsNotEmpty()
    description!: string

}
