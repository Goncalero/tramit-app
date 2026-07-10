import { IsInt, IsNotEmpty, IsUUID, Min } from "class-validator";


export class CreateDeskDto{
    
    @IsUUID()
    @IsNotEmpty()
    roomId!: string

    @IsInt()
    @Min(1) // PARA NÚMEROS SE UTILIZA EL Min EN VEZ DEL MinLength
    deskNumber!: number


}