"use client";

import Link from "next/link";

import { loginAction } from "@/actions/loginAction";

import LoginInput from "./LoginInput";
import { Button } from "./Button";
import { useFormState } from "react-dom";

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, {
    data: null,
    error: null,
  });

  const cpfError = state.error?.find(
    (err) => err.path?.join(".") === "cpf"
  )?.message;

  const passwordError = state.error?.find(
    (err) => err.path?.join(".") === "password"
  )?.message;

  return (
    <form
      action={formAction}
      className="mb-20 space-y-[1.625rem] lg:row-start-2 lg:row-end-3 lg:col-start-2 lg:col-end-2 lg:flex lg:flex-col lg:items-center lg:mb-0"
    >
      <div className="space-y-2">
        <LoginInput
          inputType="text"
          type="number"
          id="cpf"
          name="cpf"
          placeholder="CPF"
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
        />
        {state.error ? (
          <span className="pt-1 text-xs text-red-400">{passwordError}</span>
        ) : null}
      </div>
      <div className="flex justify-between items-center">
        <label htmlFor="remember" className="flex gap-3 items-center">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            className="w-5 h-5 rounded bg-gray-light border border-gray-light checked:bg-blue-900 checked:text-gray-light"
          />
          <span className="text-lilac-smooth text-xs">Lembrar-me</span>
        </label>
        <Link href="#" className="text-lilac-smooth text-xs lg:ml-8">
          Esqueci minha senha
        </Link>
      </div>
      <Button content="Entrar" type="submit" />
    </form>
  );
}
