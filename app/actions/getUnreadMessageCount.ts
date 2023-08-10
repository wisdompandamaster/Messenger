import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getUnreadMessageCount = async (userId: string) => {
  const currentUser = await getCurrentUser();

  // 保持返回值类型一致，都为 number
  if (!currentUser?.id) {
    return 0;
  }

  try {
    // 找出对话消息中第一条已读的
    const firstSeenMessage = await prisma.message.findFirst({
      where: {
        seen: {
          some: {
            id: userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!firstSeenMessage) {
      // 如果没有找到已读消息，则返回整个对话中的消息数量
      const allMessageCount = await prisma.message.count({
        where: {
          conversation: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        },
      });

      return allMessageCount;
    }

    // 如果找到最近一条已读的消息的时间，算出晚于这个消息的消息数量
    const unreadMessageCount = await prisma.message.count({
      where: {
        seen: {
          none: {
            id: userId,
          },
        },
        conversation: {
          users: {
            some: {
              id: userId,
            },
          },
        },
        createdAt: {
          gt: firstSeenMessage.createdAt,
        },
      },
    });

    return unreadMessageCount;
  } catch (error: any) {
    return 0;
  }
};

export default getUnreadMessageCount;
