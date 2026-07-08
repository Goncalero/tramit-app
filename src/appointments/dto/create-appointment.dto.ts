import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Length, MinLength } from "class-validator"


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

    @IsDateString()
    appointmentDate!: string

    @IsString()
    @IsOptional()
    observations?:string

    // ESTE ID ES EL ID QUE UNE A LA TABLA TRAMITE CON CITA
    @IsUUID()
    @IsString()
    tramitId!: string



}
