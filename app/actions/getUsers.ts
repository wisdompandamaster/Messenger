import prisma from "@/app/libs/prismadb";

import getSession from "./getSession";

// 获取好友对话列表
const getUsers = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }
  // 查找所有用户，按注册时间排列，排除自己
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });

    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
