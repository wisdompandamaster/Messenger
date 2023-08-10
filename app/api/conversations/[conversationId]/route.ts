import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await prisma?.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    // // 查询与该会话相关的所有用户
    // const users = await prisma.user.findMany({
    //   where: {
    //     OR: existingConversation.userIds.map(userId => ({ id: userId })),
    //   },
    // });

    // // 更新用户的 seenMessageIds 和 conversationIds
    // for (const user of users) {
    //   const updatedSeenMessageIds = user.seenMessageIds.filter(
    //     id => !existingConversation.messagesIds.includes(id.toString())
    //   );

    //   const updatedConversationIds = user.conversationIds.filter(
    //     id => id !== conversationId
    //   );

    //   await prisma.user.update({
    //     where: { id: user.id },
    //     data: {
    //       seenMessageIds: updatedSeenMessageIds,
    //       conversationIds: updatedConversationIds,
    //     },
    //   });
    // }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    // 对于对话里的每一个用户，都触发，对话会从它们列表中消失
    // 自己删掉对话后，别人那里的也去掉
    existingConversation.users.forEach(user => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:remove",
          existingConversation
        );
      }
    });

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.log(error, "ERROR_CONVERSATION_DELETE");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
