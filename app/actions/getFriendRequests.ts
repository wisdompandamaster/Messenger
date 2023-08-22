import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
import { request } from "http";

// 返回所有包含当前用户的 Friend Request
const getFriendRequests = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    const requests = await prisma.friend.findMany({
      // 按照 时间顺序倒序排列
      // orderBy: {
      //   createdAt: "desc",
      // },
      where: {
        // 寻找所有friends 的 friend 为本用户的, 且还未处理的实例
        friendId: currentUser.id,
        status: "pending",
      },
      include: {
        user: true,
      },
    });

    return requests;
  } catch (error: any) {
    return [];
  }
};

export default getFriendRequests;
