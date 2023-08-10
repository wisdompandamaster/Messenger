import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import getUnreadCountInConversation from "@/app/actions/getUnreadCountInConversation";
import getUnreadMessageCount from "@/app/actions/getUnreadMessageCount";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, image, conversationId } = body;

    // 如果没有用户id或邮箱
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    // 后面用来实时更新conversation
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    // Pusher Server 端
    // 推送新消息
    // 每一个监听这个 conversationId channel 的  都会收到更新
    await pusherServer.trigger(conversationId, "messages:new", newMessage);

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    // 如果在群组里，每个人都要推送
    updatedConversation.users.map(async user => {
      // 推送最后一条消息，用来显示在sidebar列表里
      let unreadCount = await getUnreadCountInConversation(
        user.id,
        conversationId
      );

      pusherServer.trigger(user.email!, "conversation:update", {
        id: conversationId,
        messages: [lastMessage],
        unreadCount: unreadCount,
      });

      let totalUnreadCount = await getUnreadMessageCount();

      pusherServer.trigger(user.email!, "conversation:totalUnread", {
        totalUnreadCount: totalUnreadCount,
      });
    });

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.log(error, "ERROR_MESSAGES");
    return new NextResponse("InternalError", { status: 500 });
  }
}
