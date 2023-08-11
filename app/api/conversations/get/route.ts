import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    // 如果没有登录认证
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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

    return NextResponse.json(conversations);
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
