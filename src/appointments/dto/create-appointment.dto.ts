import { Type } from "class-transformer"
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Length } from "class-validator"


export class CreateAppointmentDto {

    
    @IsString()
    @IsNotEmpty()
    citizenName!: string

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    citizenEmail!: string

    @IsString()
    @Length(9,9)
    @IsNotEmpty()
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
