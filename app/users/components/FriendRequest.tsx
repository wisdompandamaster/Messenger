"use client";

import { Friend } from "@prisma/client";
import RequestCard from "./RequestCard";
import { FullFriendType } from "@/app/types";
import { useEffect, useMemo, useState } from "react";
import { pusherClient } from "@/app/libs/pusher";
import { useSession } from "next-auth/react";

interface FriendRequestProps {
  requests: FullFriendType[];
}

const FriendRequest: React.FC<FriendRequestProps> = ({ requests }) => {
  const session = useSession();

  const [items, setItems] = useState(requests);

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

    const handleFriendRequest = (newFrinedRequest: FullFriendType) => {
      setItems(current => {
        current.push(newFrinedRequest);
        return current;
      });
    };

    pusherClient.bind("friend:new", handleFriendRequest);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("friend:new", handleFriendRequest);
    };
  }, [pusherKey]);

  return (
    <div
      className='
         flex
         gap-3
         px-5
         flex-wrap
      '
    >
      {items.map(request => (
        <RequestCard
          key={request.user.email}
          id={request.id}
          user={request.user!}
        />
      ))}
    </div>
  );
};

export default FriendRequest;
