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
    '
    >
      <Avatar user={user} />
      <div className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
        <HiCheck className='font-semibold text-white w-3/4 h-3/4' />
      </div>
      <div className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
        <HiX className='font-semibold text-white w-3/4 h-3/4' />
      </div>
    </div>
  );
};

export default RequestCard;
