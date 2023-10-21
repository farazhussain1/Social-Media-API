import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class PostService {
  constructor() {}

  create(userId: number, title: string, description: string) {
    console.log(userId, title, description);

    return prisma.post.create({
      data: {
        userId: userId,
        title: title,
        description: description,
      },
    });
  }

  getQ(farmId: number) {
    return prisma.$queryRaw`SELECT *, JSON_BUILD_OBJECT(
      'years', EXTRACT(YEAR FROM age(CURRENT_DATE, "Farm"."Cattle"."dob")),
      'months', EXTRACT(MONTH FROM age(CURRENT_DATE, "Farm"."Cattle"."dob")),
      'days', EXTRACT(DAY FROM age(CURRENT_DATE, "Farm"."Cattle"."dob"))
      ) AS age FROM "Farm"."Cattle" WHERE "farmId"=${farmId} ;
      `;
  }

  get(userId: number, friends: [number]) {
    friends.push(userId);
    return prisma.post.findMany({
      where: {
        userId: { in: friends },
      },
      select: {
        id: true,
        userId: true,
        title: true,
        description: true,
        updatedAt: true,
        _count: {
          select: {
            Comments: true,
            Likes: true,
          },
        },
        Likes: {
          select: {
            id: true,
            userId: true,
            updatedAt: true,
          },
          orderBy: { updatedAt: "desc" },
        },
        Comments: {
          select: {
            id: true,
            userId: true,
            comment: true,
            updatedAt: true,
          },
          orderBy: { updatedAt: "desc" },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  update(userId: number, postId: number, data: any) {
    return prisma.post.updateMany({
      where: {
        id: postId,
        userId: userId,
      },
      data: data,
    });
  }

  delete(postId: number, userId: number) {
    return prisma.post.deleteMany({
      where: {
        id: postId,
        userId: userId,
      },
    });
  }

  getUserFriends(userId: any) {
    return prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        friendReqSent: {
          where: {
            friendStatus: "Connected",
          },
          select: {
            id: true,
            user2: true,
            friendStatus: true,
          },
        },
        friendReqReceived: {
          where: {
            friendStatus: "Connected",
          },
          select: {
            id: true,
            user1: true,
            friendStatus: true,
          },
        },
      },
    });
  }

  postExist(userId: number, postId: number) {
    return prisma.post.findFirst({
      where: {
        userId: userId,
        id: postId,
      },
    });
  }

  UpdateActivity(postId: number) {
    prisma.post.update({
      where: {
        id: postId,
      },
      data: {},
    });
  }
}
