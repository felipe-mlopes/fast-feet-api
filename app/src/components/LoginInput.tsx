"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";

import { PadlockIcon } from "./icons/PadlockIcon";
import { ProfileIcon } from "./icons/ProfileIcon";
import { PasswordHiddenIcon } from "./icons/PasswordHiddenIcon";
import { PasswordShowIcon } from "./icons/PasswordShowIcon";

interface LoginInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputType: "text" | "password";
}

const LoginInput: React.ForwardRefRenderFunction<
  HTMLInputElement,
  LoginInputProps
> = ({ inputType, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="flex gap-4 w-full p-4 rounded bg-gray-light">
      <span>{inputType === "text" ? <ProfileIcon /> : <PadlockIcon />}</span>
      <span className="border-[1px] bg-bluish-gray rounded w-[1px] h-6" />
      <input
        ref={ref}
        type={showPassword ? "text" : "password"}
        onChange={(e) => e.target.value}
        className="outline-none text-base font-normal text-purple-dark bg-gray-light"
        {...props}
      />
      {inputType === "password" && (
        <span onClick={toggleShowPassword} className="cursor-pointer">
          {showPassword ? <PasswordShowIcon /> : <PasswordHiddenIcon />}
        </span>
      )}
    </div>
  );
};

export default forwardRef(LoginInput);
