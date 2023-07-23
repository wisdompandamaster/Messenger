import prisma from "@/app/libs/prismadb";

import getSession from "./getSession";

const getCurrentUser = async () => {
  try {
    const session = await getSession();

    // 如果没有用户或者没有邮箱
    if (!session?.user?.email) {
      return null;
    }

    // 数据库中找出 email 对应的当前用户
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    // 根据session 中的邮箱，在数据库中找到对应用户然后返回user的信息
    return currentUser;
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;
