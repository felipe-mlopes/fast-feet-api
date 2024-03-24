"use client";

import {
  DetailedHTMLProps,
  FormHTMLAttributes,
  PropsWithChildren,
  useState,
} from "react";
import { useFormState } from "react-dom";

import { FormStateTypes } from "@/types";

import LoginInput from "./LoginInput";
import { Modal } from "./Modal";

type HTMLFormProps = DetailedHTMLProps<
  FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

interface FormProps extends PropsWithChildren<Omit<HTMLFormProps, "action">> {
  action: (
    prevState: FormStateTypes,
    formData: FormData
  ) => Promise<FormStateTypes>;
}

export function LoginForm({ children, action, ...props }: FormProps) {
  const [state, formAction] = useFormState(action, {
    data: null,
    error: null,
  });

  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  const cpfError = state.error?.find(
    (err) => err.path?.join(".") === "cpf"
  )?.message;

  const passwordError = state.error?.find(
    (err) => err.path?.join(".") === "password"
  )?.message;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-[1.625rem] pb-24 lg:row-start-2 lg:row-end-3 lg:col-start-2 lg:col-end-2 lg:flex lg:flex-col lg:items-center lg:mb-0"
      {...props}
    >
      <div className="space-y-2">
        <LoginInput
          inputType="text"
          type="text"
          id="cpf"
          name="cpf"
          maxLength={14}
          placeholder="CPF"
          error={cpfError}
        />
        {state.error ? (
          <span className="pt-1 text-xs text-red-400">{cpfError}</span>
        ) : null}
        <LoginInput
          inputType="password"
          id="password"
          name="password"
          minLength={6}
          placeholder="Senha"
          error={passwordError}
        />
        {state.error ? (
          <span className="pt-1 text-xs text-red-400">{passwordError}</span>
        ) : null}
      </div>
      {state.error ? (
        <Modal
          type="error"
          content="Senha ou CPF incorretos."
          isOpen={isOpen}
          onClose={handleClose}
        />
      ) : null}
      {children}
    </form>
  );
}
