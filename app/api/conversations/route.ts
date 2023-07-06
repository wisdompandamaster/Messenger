import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    // 如果没有登录认证
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 如果是对话组，但是没有成员，或成员数量不够
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", {
        status: 400,
      });
    }

    // 创建群聊,同样成员的群聊可以创建多个
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => {
                id: member.value;
              }),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        // 返回时包括用户信息，名字头像之类的，不然只有id
        include: {
          users: true,
        },
      });
      return NextResponse.json(newConversation);
    }

    // 创建 one-to-one 对话，只有一个，不能重复建立，所以先找是否存在，查找过程中，不仅要找自己建立的，也要查找别人建立的和自己的对话
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];

    // 如果已经有对应对话，直接返回，不用创建
    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    // 否则建立一个新的对话
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      //   需要信息构建 UI
      include: {
        users: true,
      },
    });

    return NextResponse.json(newConversation);
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
