import { LoginForm } from "@/components/LoginForm";
import { Logo } from "@/components/Logo";
import { LogoIcon } from "@/components/icons/LogoIcon";

export default function Login() {
  return (
    <div className="flex flex-col justify-between items-center h-screen mx-8 my-10 lg:grid lg:grid-col-2 lg:grid-row-3 lg:justify-normal">
      <header className="flex items-center w-full justify-between lg:row-start-1 lg:row-end-1 lg:col-start-1 lg:col-end-2 lg:w-auto lg:justify-start lg:gap-4">
        <LogoIcon />
        <Logo />
      </header>
      <main className="lg:row-start-2 lg:row-end-3 lg:col-start-1 lg:col-end-1">
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
      <LoginForm />
    </div>
  );
}
