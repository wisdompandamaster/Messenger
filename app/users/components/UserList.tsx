"use client";

import { User } from "@prisma/client";
import UserBox from "./UserBox";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { pusherClient, pusherServer } from "@/app/libs/pusher";
import { FullFriendType } from "@/app/types";

interface UserListProps {
  friends: User[];
}

const UserList: React.FC<UserListProps> = ({ friends }) => {
  const session = useSession();

  // FIXME:can not show change in time in UserList
  const [items, setItems] = useState(friends);

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

    const handleFriendAccept = (acceptFriendRequest: FullFriendType) => {
      console.log("add friend in userlist");
      setItems(current => {
        if (acceptFriendRequest.user.email == pusherKey) {
          current.push(acceptFriendRequest.friend!);
        } else {
          current.push(acceptFriendRequest.user);
        }
        return current;
      });
    };

    pusherClient.bind("friend:accept", handleFriendAccept);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("friend:accept", handleFriendAccept);
    };
  }, [pusherKey]);

  return (
    <aside
      className='
      fixed
      inset-y-0
      pb-20
      lg:pb-0
      lg:left-20
      lg:w-80
      lg:block
      overflow-y-auto
      border-r
      border-gray-200
      block
      w-full
      left-0
    '
    >
      <div className='px-5'>
        <div className='flex-col'>
          <div
            className='
               text-2xl
               font-bold
               text-neutral-800
               py-4
            '
          >
            Friends
          </div>
        </div>
        {items.map(item => (
          <UserBox key={item.email} data={item} />
        ))}
      </div>
    </aside>
  );
};

export default UserList;
