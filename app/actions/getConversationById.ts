import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();

    // 如果没有找到对应用户（没有该用户，或没登陆），返回空
    if (!currentUser?.email) {
      return null;
    }

    // 根据conversationId 找到 conversation信息，并包括 conversation 对应 users 的信息
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    return conversation;
  } catch (error: any) {
    return null;
  }
};

export default getConversationById;
