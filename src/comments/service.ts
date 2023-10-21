import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class CommentsService {
  constructor() {}

  create(userId: number, postId: number, comment: string) {
    return prisma.comments.create({
      data: {
        userId: userId,
        postId: postId,
        comment: comment,
      },
    });
  }

  get(userId: number) {
    return prisma.comments.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        userId: true,
        postId: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        post: true,
      },
    });
  }

  update(userId: number, commentId: number, data: any) {
    console.log("here", userId, commentId, data);

    return prisma.comments.updateMany({
      where: {
        id: commentId,
        userId: userId,
      },
      data: data,
    });
  }

  updateNew(userId: number, postId: number, data: any) {
    return prisma.$transaction([
      prisma.comments.updateMany({
        where: {
          id: postId,
          userId: userId,
        },
        data: data,
      }),

      prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          updatedAt: new Date(),
        },
      }),
    ]);
  }

  delete(commentId: number, userId: number) {
    return prisma.comments.deleteMany({
      where: {
        id: commentId,
        userId: userId,
      },
    });
  }

  isExist(userId: number, postId: number) {
    return prisma.comments.findFirst({
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
