import { withAuth } from "next-auth/middleware";

// logout 后自动退出到登录页，也保护后面的页面在不登录的情况下无法访问
export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: ["/users/:path*"],
};
