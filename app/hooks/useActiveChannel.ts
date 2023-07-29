import { Channel, Members } from "pusher-js";
import useActiveList from "./useActiveList";
import { useEffect, useState } from "react";
import { pusherClient } from "../libs/pusher";

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  // 有人加入或者退出 channel 时，我们就要 更新到 global active list
  useEffect(() => {
    let channel = activeChannel;
    if (!channel) {
      // presence-messenger 只有在有 pusher authentication 时才有用
      channel = pusherClient.subscribe("presence-messenger");
      setActiveChannel(channel);
    }

    // 获取我们登录之前就登录的 active (email) list
    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];

      // members是复杂数据结构，不能简单当 array
      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id)
      );
      // set in global store
      set(initialMembers);
    });

    // 我们登录后，有别的用户登录，成为active, 要加到 global active list 中
    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      add(member.id);
    });

    // 我们登录后，有别的用户退出，成为active, 要加到 global active list 中
    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      remove(member.id);
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-messenger");
        setActiveChannel(null);
      }
    };
  }, [activeChannel, set, add, remove]);
};

export default useActiveChannel;
