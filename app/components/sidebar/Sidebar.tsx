import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getUnreadMessageCount from "@/app/actions/getUnreadMessageCount";

async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  const unreadMessageCount = await getUnreadMessageCount(currentUser?.id!);

  return (
    <div className='h-full'>
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
