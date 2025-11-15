import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    const {phone, pass, birthDate, name} = createUserDto;
    const hashedPass = bcrypt.hash(pass, 10);
    return this.prisma.user.create({
      data: {
        phone: phone,
        pass: hashedPass,
        name: name,
        birthDate: birthDate
      }
    })
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOneBy(phone: string) {
    const user = this.prisma.user.findUnique({
      where: {phone}
    });
    if (!user)
      throw new NotFoundException(`Can not find user with id ${phone}`)
    return user;
  }

  findOne(id: string) {
    const user = this.prisma.user.findUnique({
      where: {id}
    });
    if (!user)
      throw new NotFoundException(`Can not find user with id ${id}`)
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {id},
      data: updateUserDto
    })
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: {id}
    })
  }
}
