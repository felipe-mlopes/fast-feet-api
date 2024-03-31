import Link from "next/link";

import { loginAction } from "@/data/actions/login";

import { Header } from "@/components/Header";
import { Cover } from "@/components/Cover";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/Button";

export default function Login() {
  return (
    <div className="flex flex-col justify-between items-center gap-24 mx-8 mt-20 lg:grid lg:grid-col-2 lg:grid-row-3 lg:justify-normal">
      <Header />
      <Cover />
      <main className="flex flex-col gap-16 lg:row-start-2 lg:row-end-3 lg:col-start-1 lg:col-end-1">
        <div className="flex flex-col gap-4 lg:items-center">
          <h2 className="flex flex-col text-5xl font-bold text-white italic">
            <span className="text-orange-light">Entregador,</span>
            <span>você é nosso maior valor</span>
          </h2>
          <p className="text-base font-normal text-lilac-smooth mr-28">
            Faça seu login para começar suas entregas.
          </p>
        </div>
      </main>
      <LoginForm
        action={loginAction}
        className="flex flex-col gap-[1.625rem] pb-24 lg:row-start-2 lg:row-end-3 lg:col-start-2 lg:col-end-2 lg:flex lg:flex-col lg:items-center lg:mb-0"
      >
        <div className="flex justify-between items-center">
          <label htmlFor="remember" className="flex gap-3 items-center">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="w-5 h-5 rounded bg-gray-light border border-gray-light checked:border-[6px] checked:border-orange-light checked:gray-gray-light"
            />
            <span className="text-lilac-smooth text-xs">Lembrar-me</span>
          </label>
          <Link
            href={"/forgot-password"}
            className="text-lilac-smooth text-xs lg:ml-8"
          >
            Esqueci minha senha
          </Link>
        </div>
        <Button content="Entrar" type="submit" />
      </LoginForm>
    </div>
  );
}
