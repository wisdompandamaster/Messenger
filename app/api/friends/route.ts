import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { friendEmail } = body;

    // 如果没有登录认证
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 根据 email 查找好友
    const existingFriend = await prisma.user.findUnique({
      where: {
        email: friendEmail,
      },
    });

    // 如果根据邮箱找不到好友
    if (!existingFriend) {
      return new NextResponse("Not Found User", { status: 404 });
    }

    // 创建好友申请，只有一个，不能重复建立，所以先找是否存在，查找过程中，不仅要找自己建立的，也要查找别人发送给自己的好友申请
    const existingFriendRequest = await prisma.friend.findMany({
      where: {
        OR: [
          // 我已经发过的
          {
            userId: currentUser.id,
            friendId: existingFriend.id,
          },
          //   别人发给我的
          {
            userId: existingFriend.id,
            friendId: currentUser.id,
          },
        ],
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        friend: {
          select: {
            name: true,
          },
        },
      },
    });

    const singleFriendRequest = existingFriendRequest[0];

    // 如果已经有好友请求，直接返回，不用创建
    if (singleFriendRequest) {
      return NextResponse.json(singleFriendRequest);
    }

    // 否则建立一个新的好友请求
    const newFrinedRequest = await prisma.friend.create({
      data: {
        userId: currentUser.id,
        friendId: existingFriend.id,
        status: "pending",
      },
      // 需要返回的信息
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

    // 如果创建出来,就通过 pusher传递
    if (newFrinedRequest.friend.email) {
      pusherServer.trigger(
        newFrinedRequest.friend.email,
        "friend:new",
        newFrinedRequest
      );
    }

    return NextResponse.json(newFrinedRequest);
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
