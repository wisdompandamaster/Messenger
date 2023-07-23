import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

// 返回所有包含当前用户的conversation，包括conversation 的 users , messages 的具体信息
const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    const conversations = await prisma.conversation.findMany({
      // 按照conversation 中 的 last Message 字段排序
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        // 寻找所有conversations里面有本用户的，包括one-to-one 和 group
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        // 除了获取message,还获取message相关其它信息
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return conversations;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
