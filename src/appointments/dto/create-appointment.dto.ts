import { Type } from "class-transformer"
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Length, Matches } from "class-validator"


export class CreateAppointmentDto {

    
    @IsString()
    @IsNotEmpty()
    citizenName!: string

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    citizenEmail!: string

    @IsString()
    @IsNotEmpty()
    //ESTO SIRVE PARA QUE TE COJA EL FORMATO dni
    @Matches(/^\d{8}[A-Z]$/, { message: 'Introduce 8 números y una única letra mayúscula en el DNI' })
    citizenDni!: string

    @IsString()
    @Length(9,12)
    @IsNotEmpty()
    citizenPhone!: string

    @Type(() => Date) //PARA QUE LA FECHA LA CAMBIE DE string A TIPO Date
    @IsDate()
    appointmentDate!: Date

    @IsString()
    @IsOptional()
    observations?:string

    // ESTE ID ES EL ID QUE UNE A LA TABLA TRAMITE CON CITA
    @IsUUID()
    @IsString()
    tramitId!: string



}
