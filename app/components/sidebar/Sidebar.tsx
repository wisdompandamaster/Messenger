import { pusherServer } from "@/app/libs/pusher";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getUnreadMessageCount from "@/app/actions/getUnreadMessageCount";
import PusherUpdate from "@/app/context/PusherUpdate";
import { FullConversationType } from "@/app/types";
import getConversations from "@/app/actions/getConversations";
import getUnreadCountInConversation from "@/app/actions/getUnreadCountInConversation";

async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  const unreadMessageCount = await getUnreadMessageCount(currentUser?.id!);

  const conversations: FullConversationType[] = await getConversations();

  // BUG: 异步执行，导致unreadCount还未注入就传走了
  // conversations.forEach(async item => {
  //   item.unreadCount = await getUnreadCountInConversation(
  //     currentUser?.id!,
  //     item.id
  //   );
  //   console.log("Sidebar" + item.unreadCount);
  // });

  // 在刚进入 /users 时就初始化 store 中的 conversations
  for (let item of conversations) {
    item.unreadCount = await getUnreadCountInConversation(
      currentUser?.id!,
      item.id
    );
  }

  return (
    <div className='h-full'>
      <PusherUpdate initialItems={conversations} />
      <DesktopSidebar
        currentUser={currentUser!}
        unreadMessageCount={unreadMessageCount}
      />
      <MobileFooter unreadMessageCount={unreadMessageCount} />
      <main className='lg:pl-20 h-full'>{children}</main>
    </div>
  );
}

export default Sidebar;
