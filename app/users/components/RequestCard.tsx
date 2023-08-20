"use client";

import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";
import { HiX, HiCheck } from "react-icons/hi";

interface RequestCardProps {
  user: User;
}

const RequestCard: React.FC<RequestCardProps> = ({ user }) => {
  return (
    <div
      className='
        flex 
        gap-4 
        items-center
        h-20
        w-72
        p-5
        bg-neutral-100
        rounded-xl
        m-5
    '
    >
      <Avatar user={user} />
      <div className='w-8 h-8 bg-sky-400 hover:bg-sky-500 grid place-items-center rounded-full transition hover:shadow-md'>
        <HiCheck className='font-semibold text-white w-3/4 h-3/4' />
      </div>
      <div className='w-8 h-8 bg-rose-500 hover:bg-rose-600 grid place-items-center rounded-full transition hover:shadow-md'>
        <HiX className='font-semibold text-white w-3/4 h-3/4' />
      </div>
    </div>
  );
};

export default RequestCard;
