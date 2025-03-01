import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }
  async getProfile(userId: string) {
    const profile = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        scores: true,
      },
    });
    return profile;
  }
}
