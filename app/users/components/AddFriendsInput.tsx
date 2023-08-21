"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface AddFriendsInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const AddFriendsInput: React.FC<AddFriendsInputProps> = ({
  placeholder,
  id,
  type,
  required,
  register,
  errors,
}) => {
  return (
    <div className='relative w-full'>
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className='
          text-black
          font-light
          py-2
          px-4
          bg-neutral-100
          w-full
          rounded-lg
          focus:outline-none
        '
      />
    </div>
  );
};

export default AddFriendsInput;
