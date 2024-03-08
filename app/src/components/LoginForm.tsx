"use client";

import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";

import { formSchema } from "@/libs/zod/validation";
import { getCredentials } from "@/server/getCredentials";

import LoginInput from "./LoginInput";
import { Button } from "./Button";

type FormTypes = z.infer<typeof formSchema>;

export function LoginForm() {
  const {
    register,
    formState: { errors },
  } = useForm<FormTypes>({
    mode: "all",
    resolver: zodResolver(formSchema),
  });

  return (
    <form
      action={getCredentials}
      // method="POST"
      className="mb-20 space-y-[1.625rem]"
    >
      <div className="space-y-2">
        <LoginInput
          inputType="text"
          type="number"
          id="cpf"
          maxLength={14}
          placeholder="CPF"
          {...register("cpf")}
        />
        <LoginInput
          inputType="password"
          id="password"
          minLength={6}
          placeholder="Senha"
          {...register("password")}
        />
      </div>
      <div>
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
          <Link href="#" className="text-lilac-smooth text-xs">
            Esqueci minha senha
          </Link>
        </div>
      </div>
      <Button content="Entrar" type="submit" />
    </form>
  );
}
