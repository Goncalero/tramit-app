import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from '../interfaces/jwt.payload.interfaces';
import { User } from "src/users/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        @InjectRepository(User)
        private readonly userRepository : Repository<User>,
        
        configService : ConfigService

    ){
        const secret = configService.get<string>('JWT_SECRET')
        if(!secret)
            throw new Error('JWT_SECRET no está definido')

        super({
            secretOrKey: secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    
    async validate( payload: JwtPayload ): Promise<User>{

        const { id } = payload

        const searchUser = await this.userRepository.findOneBy({ id })

        if ( !searchUser )
            throw new UnauthorizedException('Token no válido')

        if( !searchUser.isActive )
            throw new UnauthorizedException('Usuario no activo')

        return searchUser
    }
}