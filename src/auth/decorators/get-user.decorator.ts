import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { User } from '../../users/entities/user.entity';




export const GetUser = createParamDecorator(
    (data: keyof User, ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest()
        const user = req.user

        if( !user )
            throw new InternalServerErrorException('Usuario no encontrado')
        if( !user.email )
            throw new InternalServerErrorException('Email no encontrado')

        return ( !data ) ? user : user[data]
    }
)

