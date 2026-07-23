import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";


export class CreateLoginUserDto {

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email!: string

    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    password!: string

}
