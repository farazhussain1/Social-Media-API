import { FriendshipStatus, PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

export class ConnectionService {
  constructor() {}

  getUser(id: any) {
    return prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        friendReqSent: {
          select: {
            id: true,
            user2: true,
            friendStatus: true,
          },
        },
        friendReqReceived: {
          select: {
            id: true,
            user1: true,
            friendStatus: true,
            sender: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  getUserToConn(userId: number, data: any) {
    console.log(userId);

    return prisma.user.findMany({
      where: {
        AND: [{ id: { notIn: userId } }, { id: { notIn: data } }],
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        friendReqSent: true,
        friendReqReceived: true,
      },
    });
  }

  requestExist(userId: number, userRequested: number) {
    return prisma.friends.findFirst({
      where: {
        OR: [
          { AND: [{ user1: userId }, { user2: userRequested }] },
          { AND: [{ user1: userRequested }, { user2: userId }] },
        ],
      },
    });
  }

  createRequest(
    userId: number,
    userRequested: number,
    connectionType: FriendshipStatus
  ) {
    return prisma.friends.create({
      data: {
        user1: userId,
        user2: userRequested,
        friendStatus: connectionType,
      },
    });
  }

  updateConnection(connectionId: number, connectionType: FriendshipStatus) {
    return prisma.friends.update({
      where: { id: connectionId },
      data: {
        friendStatus: connectionType,
      },
    });
  }
}
