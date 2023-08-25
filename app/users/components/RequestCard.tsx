"use client";

import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";
import axios from "axios";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { HiX, HiCheck } from "react-icons/hi";

interface RequestCardProps {
  id: string;
  user: User;
}

const RequestCard: React.FC<RequestCardProps> = ({ id, user }) => {
  const handleRequest = useCallback((id: string, option: string) => {
    axios
      .post("/api/friends/handle", {
        id: id,
        option: option,
      })
      .then(data => {
        toast.success(`${option} ${data.data?.user.name} successfully!`);
      })
      .catch(() => toast.error("Something went wrong!"));
  }, []);

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
      <div
        className='w-8 h-8 bg-sky-400 hover:bg-sky-500 grid place-items-center rounded-full transition hover:shadow-md'
        onClick={() => handleRequest(id, "accept")}
      >
        <HiCheck className='font-semibold text-white w-3/4 h-3/4' />
      </div>
      <div
        className='w-8 h-8 bg-rose-500 hover:bg-rose-600 grid place-items-center rounded-full transition hover:shadow-md'
        onClick={() => handleRequest(id, "deny")}
      >
        <HiX className='font-semibold text-white w-3/4 h-3/4' />
      </div>
    </div>
  );
};

export default RequestCard;
