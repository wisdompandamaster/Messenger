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
      // 如果接受，就标记为 accept
      const acceptFriendRequest = await prisma.friend.update({
        where: {
          id: id,
        },
        data: {
          status: option,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          friend: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      if (acceptFriendRequest) {
        pusherServer.trigger(
          acceptFriendRequest.user.email!,
          "friend:accept",
          acceptFriendRequest
        );
        pusherServer.trigger(
          acceptFriendRequest.friend.email!,
          "friend:accept",
          acceptFriendRequest
        );
      }

      return NextResponse.json(acceptFriendRequest);
    } else {
      // 如果拒绝，就删除记录
      const deleteFriendRequest = await prisma.friend.delete({
        where: {
          id: id,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          friend: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      if (deleteFriendRequest) {
        pusherServer.trigger(
          deleteFriendRequest.user.email!,
          "friend:deny",
          deleteFriendRequest
        );
        pusherServer.trigger(
          deleteFriendRequest.friend.email!,
          "friend:deny",
          deleteFriendRequest
        );
      }

      return NextResponse.json(deleteFriendRequest);
    }
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
