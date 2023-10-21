import { PrismaClient, User } from "@prisma/client";
import { any } from "joi";
const prisma = new PrismaClient();

export class UserService {
  constructor() {}

  get(data: User) {
    return prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { id: data.id }],
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        friendReqSent:true,
        friendReqReceived:true,
      },
    });
  }

  isExists(data: any) {
    return prisma.user.findFirst({
      where: { email: data },
    });
  }

  create(user: any) {
    return prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });
  }

  delete(email: string) {
    return prisma.user.delete({ where: { email: email } });
  }

  update(email: string, data: any) {
    return prisma.user.update({
      where: { email: email },
      data: data,
    });
  }

  getAll(query: string) {
    console.log(query);

    return prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        email: true,
        username: true,
        friendReqSent:true,
        friendReqReceived:true,
      },
    });
  }

  updateProfile(id: number, data: any) {
    return prisma.user.update({
      where: { id: id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        friendReqSent:true,
        friendReqReceived:true,
      },
      data: {
        username: data.username,
      },
    });
  }
}
