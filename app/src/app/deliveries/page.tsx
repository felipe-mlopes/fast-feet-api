import Link from "next/link";

import { Card } from "@/components/Card";
import { ButtonStatus } from "@/components/ButtonStatus";

import { ExistIcon } from "@/components/icons/ExistIcon";
import { PinIcon } from "@/components/icons/PinIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";

export default function Deliveries() {
  return (
    <div className="flex flex-col justify-between items-center mt-20 relative h-screen lg:grid lg:grid-col-2 lg:grid-row-3 lg:justify-normal">
      <header className="space-y-8 w-full px-6 pb-16">
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-lilac-smooth">
            <p>Bem vindo,</p>
            <p>Tiago Luchtenberg</p>
          </div>
          <Link href={"/"}>
            <ExistIcon />
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-[2rem] text-white">Entregas</h3>
          <div className="flex items-center gap-2">
            <PinIcon />
            <p className="text-lilac-smooth">Rio do Sul</p>
          </div>
        </div>
      </header>
      <section className="flex justify-center px-6 w-full absolute top-40 z-10">
        <div className="flex items-center justify-around gap-4 px-6 py-5 w-full bg-white border rounded shadow-card">
          <input
            type="search"
            name=""
            id=""
            placeholder="Filtrar por bairro"
            className="outline-none appearance-none bg-white"
          />
          <button>
            <SearchIcon />
          </button>
        </div>
      </section>
      <main className="px-6 pt-[3.25rem] pb-8 w-full h-screen bg-gray-light">
        <div className="flex items-center gap-5 text-ligth-slate-gray">
          <span className="content=[''] w-1/3 h-[1px] bg-bluish-gray" />
          <p className="text-nowrap">8 entregas</p>
          <span className="content=[''] w-1/3 h-[1px] bg-bluish-gray" />
        </div>
        <div className="space-y-4 pt-4">
          {Array.from({ length: 1 }, (_, i) => i++).map((idx) => {
            return <Card key={idx} />;
          })}
        </div>
      </main>
      <ButtonStatus />
    </div>
  );
}
