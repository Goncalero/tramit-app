import { IsNotEmpty, IsString, IsUUID, Min } from "class-validator";


export class CreateDeskDto{
    
    @IsUUID()
    @IsNotEmpty()
    roomId!: string

    @IsString()
    deskNumber!: string


}