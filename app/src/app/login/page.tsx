import { Header } from "@/components/Header";
import { Cover } from "@/components/Cover";
import { LoginForm } from "@/components/LoginForm";

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
      <LoginForm />
    </div>
  );
}
