"use client";

import clsx from "clsx";
import Link from "next/link";
import Badge from "../Badge";
import { useEffect, useMemo, useState } from "react";
import { pusherClient } from "@/app/libs/pusher";
import { useSession } from "next-auth/react";
import { FullConversationType } from "@/app/types";
import useTotalUnread from "@/app/hooks/useTotalUnread";

interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
  badge: number | boolean;
}

const DesktopTtem: React.FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
  badge,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };
  return (
    <li onClick={handleClick}>
      <Link
        href={href}
        className={clsx(
          `
            group
            relative
            flex
            gap-x-3
            rounded-md
            p-3
            text-sm
            leading-6
            font-semibold
            text-gray-500
            hover:text-black
            hover:bg-gray-100`,
          active && "bg-gray-100 text-black"
        )}
      >
        <Icon className='h-6 w-6 shrink-0' />
        <span className='sr-only'>{label}</span>
        <Badge count={badge} />
      </Link>
    </li>
  );
};

export default DesktopTtem;
