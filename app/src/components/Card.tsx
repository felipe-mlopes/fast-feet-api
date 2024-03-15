import { ArrowRightIcon } from "./icons/ArrowRightIcon";
import { PackageIcon } from "./icons/PackageIcon";

export function Card() {
  return (
    <div className="space-y-6 bg-white rounded shadow-card">
      <div className="space-y-8 px-4 pt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <PackageIcon />
            <h4 className="text-[1.375rem] text-purple-dark">Pacote 03</h4>
          </div>
          <p className="text-[0.625rem] font-medium text-lavender-gray">
            01/07/2020
          </p>
        </div>
        <div className="step-item">
          <div className="flex justify-between w-full uppercase text-[0.625rem] font-bold text-ligth-slate-gray">
            <p>Aguardando</p>
            <p>Retirado</p>
            <p>Entregue</p>
          </div>
        </div>
      </div>
      <button className="flex justify-between items-center p-4 w-full bg-yellow-slow">
        <span className="font-medium text-purple-dark">Detalhes</span>
        <ArrowRightIcon />
      </button>
    </div>
  );
}
