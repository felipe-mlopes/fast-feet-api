"use client";

import React, {
  ChangeEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  forwardRef,
} from "react";

import { PadlockIcon } from "./icons/PadlockIcon";
import { ProfileIcon } from "./icons/ProfileIcon";
import { PasswordHiddenIcon } from "./icons/PasswordHiddenIcon";
import { PasswordShowIcon } from "./icons/PasswordShowIcon";
import { cpfMask } from "@/utils/cpfMask";

interface LoginInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputType: "text" | "password";
  error?: string | undefined;
}

const LoginInput: React.ForwardRefRenderFunction<
  HTMLInputElement,
  LoginInputProps
> = ({ inputType, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isProfileIconChangeColor, setIsProfileIconChangeColor] =
    React.useState(false);
  const [isPadlockIconChangeColor, setIsPadlockIconChangeColor] =
    React.useState(false);

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleChangeValue({ currentTarget }: ChangeEvent<HTMLInputElement>) {
    currentTarget.setCustomValidity(error ?? "");
    const { value, name } = currentTarget;

    if (name === "cpf") {
      const formattedValue = cpfMask(value);
      currentTarget.value = formattedValue;

      const charMaxLength = props.maxLength ?? 0;
      value.length >= charMaxLength
        ? setIsProfileIconChangeColor(true)
        : setIsProfileIconChangeColor(false);
    }

    currentTarget.value;
    const charMinLength = props.minLength ?? 0;
    value.length >= charMinLength && name !== "cpf"
      ? setIsPadlockIconChangeColor(true)
      : setIsPadlockIconChangeColor(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  }

  return (
    <div className="flex justify-between gap-4 w-full p-4 rounded bg-gray-light">
      <div className="flex gap-4 items-center justify-start">
        <span>
          {inputType === "text" ? (
            <ProfileIcon isActived={isProfileIconChangeColor} />
          ) : (
            <PadlockIcon isActived={isPadlockIconChangeColor} />
          )}
        </span>
        <span className="border-[1px] bg-bluish-gray rounded w-[1px] h-6" />
        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          required={true}
          onChange={handleChangeValue}
          onKeyDown={handleKeyDown}
          className="outline-none text-base font-normal text-purple-dark bg-gray-light appearance-none"
          {...props}
        />
      </div>
      {inputType === "password" && (
        <span onClick={toggleShowPassword} className="cursor-pointer">
          {showPassword ? <PasswordShowIcon /> : <PasswordHiddenIcon />}
        </span>
      )}
    </div>
  );
};

export default forwardRef(LoginInput);
