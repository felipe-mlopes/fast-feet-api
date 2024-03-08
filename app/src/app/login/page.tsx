import { LoginForm } from "@/components/LoginForm";
import { Logo } from "@/components/Logo";
import { LogoIcon } from "@/components/icons/LogoIcon";

export default function Login() {
  return (
    <div className="flex flex-col justify-between h-screen mx-8 my-10">
      <header className="flex items-center justify-between">
        <LogoIcon />
        <Logo />
      </header>
      <main>
        <div className="space-y-4">
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
