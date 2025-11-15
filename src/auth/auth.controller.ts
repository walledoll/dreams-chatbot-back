import { Body, Controller, Get, Post, Res, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from './auth.guard';
import { jwtConstants } from './constants';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
    @Post('register')
    async register(@Body() dto: CreateUserDto, @Res({passthrough: true}) res: Response){
        const {access_token, user} = await this.authService.register(dto);

        res.cookie('auth_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        })
        return {message: `${user.name}'s registration successful`};
    }
    @Post('login')
    async login(
        @Body() { phone, pass },
        @Res({ passthrough: true }) response: Response,
    ): Promise<{ message: string } | UnauthorizedException> {
        const data = await this.authService.signIn(phone, pass);

        if (!data) throw new UnauthorizedException();

        const { access_token } = data;

        response.cookie(jwtConstants.cookieName, access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });
        console.log(access_token);

        return { message: 'Login successful' };
    }
    @Post('logout')
    @UseGuards(AuthGuard)
    logout(
        @Res({ passthrough: true }) response: Response,
    ): Record<string, string> {
        response.clearCookie(jwtConstants.cookieName);
        return { message: 'Logout successful' };
    }

    @UseGuards(AuthGuard)
    @Get('me')
    getMe(@Request() req: Record<string, any>): Response {
        return req?.user as Response;
    }
}
