import prisma from "@/app/libs/prismadb";

import getSession from "./getSession";

const getCurrentUser = async () => {
  try {
    const session = await getSession();

    // 如果没有用户或者没有邮箱
    if (!session?.user?.email) {
      return null;
    }

    // 数据库中找出匹配的当前用户
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;
