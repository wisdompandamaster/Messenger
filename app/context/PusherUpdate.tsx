"use client";

import { useEffect, useMemo } from "react";
import { pusherClient } from "../libs/pusher";
import { useSession } from "next-auth/react";
import { FullConversationType } from "../types";
import useTotalUnread from "../hooks/useTotalUnread";
import toast from "react-hot-toast";

interface PusherUpdateProps {
  initialItems: FullConversationType[];
}

const PusherUpdate: React.FC<PusherUpdateProps> = ({ initialItems }) => {
  // console.log("Pusher Update!");
  const { set, conversations } = useTotalUnread();
  // pusherKey, 就是当前用户email
  const session = useSession();
  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    set(initialItems);
  }, [initialItems, set]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    // 订阅对应属于自己的 channel
    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: FullConversationType) => {
      let newItems = conversations.map(currentConversation => {
        // 找到list中要更新最新消息的那个
        if (currentConversation.id === conversation.id) {
          return {
            ...currentConversation,
            messages: conversation.messages,
            unreadCount: conversation.unreadCount,
          };
        }

        return currentConversation;
      });

      set(newItems);
      toast.success("new message!");
    };

    pusherClient.bind("conversation:update", updateHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:update", updateHandler);
    };
  }, [conversations, pusherKey, set]);

  return <div></div>;
};

export default PusherUpdate;
