import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import getUnreadCountInConversation from "../actions/getUnreadCountInConversation";
import getCurrentUser from "../actions/getCurrentUser";
import { FullConversationType } from "../types";
import { useEffect } from "react";
import { pusherClient } from "../libs/pusher";
import useTotalUnread from "../hooks/useTotalUnread";

export default async function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations: FullConversationType[] = await getConversations();
  const users = await getUsers();
  const currentUser = await getCurrentUser();

  // const data = await fetch("https://newtab.wisdompanda.com/api/news/get/", {
  //   cache: "no-store",
  // });
  // console.log(data.body);

  // const conversation: FullConversationType[] = data.body;
  // 对其中每一个conversation, 求出它们的未读消息数量，来初始化 unreadCount
  for (let item of conversations) {
    item.unreadCount = await getUnreadCountInConversation(
      currentUser?.id!,
      item.id
    );
  }

  return (
    <Sidebar>
      <div className='h-full'>
        <ConversationList initialItems={conversations} users={users} />
        {children}
      </div>
    </Sidebar>
  );
}
