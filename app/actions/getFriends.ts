import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

// 用户的好友列表
const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    const friends = await prisma.friend.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        OR: [
          {
            userId: currentUser.id,
            status: "accept",
          },
          {
            friendId: currentUser.id,
            status: "accept",
          },
        ],
      },
      include: {
        user: true,
        friend: true,
      },
    });

    const friendUsers = friends.map(friend => {
      if (friend.userId === currentUser.id) {
        return friend.friend;
      } else {
        return friend.user;
      }
    });

    return friendUsers;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
