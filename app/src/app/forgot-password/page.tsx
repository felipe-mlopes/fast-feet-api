import Link from "next/link";

import { Header } from "@/components/Header";
import { Cover } from "@/components/Cover";

import { LongArrowIcon } from "@/components/icons/LongArrowIcon";

export default function ForgotPassword() {
  return (
    <div className="flex flex-col justify-between items-center gap-24 mx-8 my-20 lg:grid lg:grid-col-2 lg:grid-row-3 lg:justify-normal">
      <Header />
      <Cover />
      <main className="flex flex-col gap-16 lg:row-start-2 lg:row-end-3 lg:col-start-1 lg:col-end-1">
        <div className="flex flex-col gap-6 lg:items-center">
          <h2 className="flex flex-col text-5xl font-bold text-white italic">
            <span className="text-orange-light">Esqueceu</span>
            <span>sua senha?</span>
          </h2>
          <p className="text-base font-normal text-lilac-smooth mr-[4.5rem]">
            Por motivos de segurança, para recurá-la, vá até a central da
            distribuidora Fastfeet.
          </p>
        </div>
        <div>
          <strong className="text-xs text-white  uppercase">endereço</strong>
          <p className="text-lilac-smooth">Rua Guilherme Gemballa, 260</p>
          <p className="text-lilac-smooth">Jardim América, SC</p>
          <p className="text-lilac-smooth">89 168-000</p>
        </div>
      </main>
      <footer className="flex justify-between items-center w-full pt-24">
        <Link href={"/login"}>
          <LongArrowIcon />
        </Link>
        <Link href={"/login"} className="font-medium text-white">
          Voltar para o login
        </Link>
      </footer>
    </div>
  );
}
