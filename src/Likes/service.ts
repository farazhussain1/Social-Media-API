import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class LikesService {
  constructor() {}

  create(userId: number, postId: number) {
    return prisma.likes.create({
      data: {
        userId: userId,
        postId: postId,
      },
    });
  }

  get(userId: number) {
    return prisma.likes.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        userId: true,
        post: true,
      },
    });
  }

  delete(likeId: number, userId: number) {
    return prisma.likes.deleteMany({
      where: {
        id: likeId,
        userId: userId,
      },
    });
  }

  isExist(userId: number, postId: number) {
    return prisma.likes.findFirst({
      where: { userId: userId, postId: postId },
    });
  }

  UpdateActivity(postId: number) {
    return prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        updatedAt: new Date(),
      },
    });
  }
}
