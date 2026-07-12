import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";


export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    name!: string

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email!: string

    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    password!: string

    @IsString({ each: true }) // RECORRE LOS ELEMENTOS DEL ARRAY Y SE CERCIORA DE QUE TODOS SON string
    @IsArray()
    @IsOptional()
    role?: string[]
}
