"use client";

import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  content: string;
}

export function Button({ content, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full px-[8.25rem] py-[1.125rem] rounded whitespace-nowrap bg-orange-light text-purple-dark hover:bg-orange-300 font-medium disabled:opacity-50 lg:w-auto"
      disabled={pending}
      {...props}
    >
      {pending ? "Carregando..." : content}
    </button>
  );
}
