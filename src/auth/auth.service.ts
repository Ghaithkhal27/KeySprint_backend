import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs'; 

@Injectable() 
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) {}

    async validateUser(password: string, email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValidate = await bcrypt.compare(password, user.password);
        if (!passwordValidate) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }

    async login(user: Record<string, unknown>) {
        const data = { id: user.id, username: user.username, email: user.email };
        return { token: this.jwt.sign(data) };
    }

    async register(data: { username: string, email: string, password: string }) {
        const hashPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: { ...data, password: hashPassword }
        });
        const tokenData = { id: user.id, username: user.username, email: user.email };
        return { token: this.jwt.sign(tokenData) };
    }

 
}
