"use client";

import clsx from "clsx";
import Link from "next/link";
import Badge from "../Badge";
import { useEffect, useMemo, useState } from "react";
import { pusherClient } from "@/app/libs/pusher";
import { useSession } from "next-auth/react";
import { FullConversationType } from "@/app/types";

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
  const session = useSession();
  const [unreadCount, setUnreadCount] = useState(badge);

  // pusherKey, 就是当前用户email
  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    // 订阅对应属于自己的 channel
    pusherClient.subscribe(pusherKey);

    const totalUnreadHandler = (totalUnreadCount: {
      totalUnreadCount: number;
    }) => {
      console.log("hello" + totalUnreadCount);
      setUnreadCount(totalUnreadCount.totalUnreadCount);
    };

    pusherClient.bind("conversation:totalUnread", totalUnreadHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:totalUnread", totalUnreadHandler);
    };
  }, [unreadCount, pusherKey]);

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
        <Badge count={unreadCount} />
      </Link>
    </li>
  );
};

export default DesktopTtem;
