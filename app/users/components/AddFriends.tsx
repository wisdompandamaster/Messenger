"use client";

import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AddFriendsInput from "./AddFriendsInput";
import { HiPaperAirplane } from "react-icons/hi2";
import toast from "react-hot-toast";

const AddFriends = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      friendEmail: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = data => {
    setValue("friendEmail", "", { shouldValidate: true });
    axios
      .post("/api/friends", {
        ...data,
      })
      .then(data => {
        toast.success(`Send Request to ${data.data.friend.name} Successfully!`);
      })
      .catch(e => {
        toast.error(e.response.data);
      });
  };

  return (
    <div
      className='
      py-8
      px-5
      bg-white
      border-t
      flex
      items-center
      gap-2
      lg:gap-4
      w-2/5
    '
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='
          flex items-center gap-2 lg:gap-4 w-full
        '
      >
        <AddFriendsInput
          id='friendEmail'
          register={register}
          errors={errors}
          required
          placeholder='Write an user email to add friends'
        />
        <button
          type='submit'
          className='
              rounded-lg
              py-2
              px-4
              bg-sky-500
              cursor-pointer
              hover:bg-sky-600
              transition
            '
        >
          <HiPaperAirplane size={18} className='text-white' />
        </button>
      </form>
    </div>
  );
};

export default AddFriends;
