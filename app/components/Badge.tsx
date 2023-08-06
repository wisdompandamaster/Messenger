"use client";

import clsx from "clsx";

interface BadgeProps {
  // 设置为 false, 或数字为 0 时不显示 badge
  count: number | boolean;
  danger?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ count, danger }) => {
  return (
    <div
      className={clsx(
        `
        absolute
        block
        text-center
        text-white
        text-xs
        leading-5
        rounded-full
        ring-2
        ring-white
        top-0
        right-0
        h-4
        w-4
        md:h-5
        md:w-5  
      `,
        danger ? "bg-red-500" : "bg-sky-500",
        !count && "hidden"
      )}
    >
      {count}
    </div>
  );
};

export default Badge;
