"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";

interface MobileFooterProps {
  unreadMessageCount: number;
}

const MobileFooter: React.FC<MobileFooterProps> = ({ unreadMessageCount }) => {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  const Badge = [0, 0, 0];

  if (isOpen) {
    return null;
  }

  return (
    <div
      className='
        fixed
        justify-between
        w-full
        bottom-0
        z-40
        flex
        items-center
        bg-white
        border-t-[1px]
        lg:hidden
      '
    >
      {routes.map((route, index) => (
        <MobileItem
          key={route.href}
          href={route.href}
          active={route.active}
          icon={route.icon}
          badge={Badge[index]}
          onClick={route.onClick}
        />
      ))}
    </div>
  );
};

export default MobileFooter;
