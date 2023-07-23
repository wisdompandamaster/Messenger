import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/route";

// 从next-auth 的 session 中获取登录信息
export default async function getSession() {
  return await getServerSession(authOptions);
}
