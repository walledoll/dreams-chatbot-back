import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
        constructor(
        private users: UsersService,
        private jwtService: JwtService
    ){}

    async signIn(phone: string, pass: string){
        const user = await this.users.findOneBy(phone);
        if(!user)
            throw new UnauthorizedException('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(pass, user.pass as string);
        if(!isPasswordValid)
            throw new UnauthorizedException('Invalid credentials');

        const {id: userId, phone: userPhone } = user;

        const payload = {sub: userId, phone: userPhone };
        return {
            access_token: await this.jwtService?.signAsync(payload)
        }
    }

    async register(createUserDto: CreateUserDto){
        const user = await this.users.create(createUserDto);

        const payload = {sub: user.id, email: user.phone};
        const access_token = await this.jwtService.signAsync(payload);

        return {access_token, user: {id: user.id, name: user.name}}
    }
}
