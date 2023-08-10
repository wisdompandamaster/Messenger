import getCurrentUser from "@/app/actions/getCurrentUser";
import getUnreadCountInConversation from "@/app/actions/getUnreadCountInConversation";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { tr } from "date-fns/locale";
import { NextResponse } from "next/server";

interface IParams {
  conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 找到目前的conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    // 没有找到对应conversation
    if (!conversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    // 找到当前conversation后，找到 last message

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    // 没找到最新消息
    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    // 如果有，更新last message 的 seen
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            image: true,
            name: true,
          },
        },
        seen: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    let unreadCount = await getUnreadCountInConversation(
      currentUser.id,
      conversationId!
    );

    // Update all connections with new seen
    // TODO: updatedMessage太长，之前删掉了对话，但是user里面的seenMessagIds没删掉
    // console.log("error: " + JSON.stringify(updatedMessage));
    await pusherServer.trigger(currentUser.email, "conversation:update", {
      id: conversationId,
      messages: [updatedMessage],
      unreadCount: unreadCount,
    });

    // If user has already seen the message, no need to go further
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    // Update last message seen
    await pusherServer.trigger(
      conversationId!,
      "message:update",
      updatedMessage
    );

    return NextResponse.json(updatedMessage);
  } catch (error: any) {
    console.log(error, "ERROR_MESSAGE_SEEN");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
