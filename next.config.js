/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // 这个插件 可以清洁复杂对象，让他可以从 server component 发到 client component
    swcPlugins: [["next-superjson-plugin", {}]],
  },
  // 用的 next Image组件，确定外来的图片来源范围
  images: {
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
