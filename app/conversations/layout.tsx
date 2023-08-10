import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import getUnreadCountInConversation from "../actions/getUnreadCountInConversation";
import getCurrentUser from "../actions/getCurrentUser";
import { FullConversationType } from "../types";
import { useEffect } from "react";
import { pusherClient } from "../libs/pusher";

export default async function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations: FullConversationType[] = await getConversations();
  const users = await getUsers();
  const currentUser = await getCurrentUser();

  // 对其中每一个conversation, 求出它们的未读消息数量，来初始化 unreadCount
  conversations.forEach(async item => {
    item.unreadCount = await getUnreadCountInConversation(
      currentUser?.id!,
      item.id
    );
  });

  console.log("组件conversation layout");

  return (
    <Sidebar>
      <div className='h-full'>
        <ConversationList initialItems={conversations} users={users} />
        {children}
      </div>
    </Sidebar>
  );
}
