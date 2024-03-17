import Link from "next/link";

import { StatusSteps } from "./StatusSteps";

import { ArrowIcon } from "./icons/ArrowIcon";
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
        <StatusSteps />
      </div>
      <Link
        href={"/deliveries/1"}
        className="flex justify-between items-center p-4 w-full bg-yellow-slow"
      >
        <span className="font-medium text-purple-dark">Detalhes</span>
        <ArrowIcon side="right" className="fill-lavender-gray" />
      </Link>
    </div>
  );
}
