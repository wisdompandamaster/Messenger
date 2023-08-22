import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { id, option } = body;

    // 如果没有登录认证
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 根据 friend id 查找记录
    if (option == "accept") {
      const deleteFriendRequest = await prisma.friend.delete({
        where: {
          id: id,
        },
      });
      return NextResponse.json(deleteFriendRequest);
    } else {
      const acceptFriendRequest = await prisma.friend.update({
        where: {
          id: id,
        },
        data: {
          status: option,
        },
      });
      return NextResponse.json(acceptFriendRequest);
    }
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
