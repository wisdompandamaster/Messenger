"use client";

import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";
import { HiX, HiCheck } from "react-icons/hi";

interface FriendRequestProps {
  user: User;
}

const FriendRequest: React.FC<FriendRequestProps> = ({ user }) => {
  return (
    <div
      className='
        flex 
        gap-4 
        items-center
        h-20
        p-5
        w-fit
        bg-neutral-100
        rounded-xl
    '
    >
      <Avatar user={user} />
      <div
        className='
        flex
        flex-col
        justify-between
      '
      >
        <p className='font-semibold'>{user.name}</p>
        <p className='text-gray-400'>{user.email}</p>
      </div>
      <div className='w-8 h-8 bg-sky-400 hover:bg-sky-500 grid place-items-center rounded-full transition hover:shadow-md'>
        <HiCheck className='font-semibold text-white w-3/4 h-3/4' />
      </div>
      <div className='w-8 h-8 bg-rose-500 hover:bg-rose-600 grid place-items-center rounded-full transition hover:shadow-md'>
        <HiX className='font-semibold text-white w-3/4 h-3/4' />
      </div>
    </div>
  );
};

export default FriendRequest;
