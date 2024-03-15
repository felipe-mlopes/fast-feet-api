import { Button } from "@/components/Button";
import { ExistIcon } from "@/components/icons/ExistIcon";
import { PinIcon } from "@/components/icons/PinIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";

export default function Deliveries() {
  return (
    <div className="flex flex-col justify-between items-center gap-24 mt-20 lg:grid lg:grid-col-2 lg:grid-row-3 lg:justify-normal">
      <header className="space-y-8 w-full px-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-lilac-smooth">
            <p>Bem vindo,</p>
            <p>Tiago Luchtenberg</p>
          </div>
          <ExistIcon />
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-[2rem] text-white">Entregas</h3>
          <div className="flex items-center gap-2">
            <PinIcon />
            <p className="text-lilac-smooth">Rio do Sul</p>
          </div>
        </div>
      </header>
      <main className="relative w-full bg-white">
        <div className="flex items-center justify-start gap-4 px-6 absolute bg-white border border-black rounded shadow-sm">
          <input
            type="search"
            name=""
            id=""
            placeholder="Filtrar por bairro"
            className="px-6 py-5 bg-white"
          />
          <button>
            <SearchIcon />
          </button>
        </div>
        <div className="space-y-3">
          <Button content="" />
          <Button content="" />
          <Button content="" />
          <Button content="" />
          <Button content="" />
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
