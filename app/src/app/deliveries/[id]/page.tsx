import Link from "next/link";

import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { FolderIcon } from "@/components/icons/FolderIcon";
import { InfoIcon } from "@/components/icons/InfoIcon";
import { Action } from "@/components/Action";

export default function DeliveryDetails({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <div className="h-screen overflow-hidden bg-gray-light">
      <header className="flex items-center justify-start gap-24 pl-5 pt-14 pb-12 relative bg-indigo-blue">
        <Link href={"/deliveries"}>
          <ArrowIcon side="left" className="fill-white" />
        </Link>
        <h2 className="text-[1.625rem] text-white">Detalhes</h2>
      </header>
      <main className="flex flex-col justify-around px-6 h-screen relative">
        <div className="flex flex-col justify-center gap-4 w-[23rem] absolute -top-8 right-1/2 translate-x-1/2">
          <section className="px-4 py-6 rounded bg-white">
            <div className="flex items-center gap-3">
              <FolderIcon />
              <h3 className="text-[1.375rem] text-purple-dark">Dados</h3>
            </div>
            <div className="space-y-2 pt-8">
              <strong className="uppercase text-[0.625rem] text-purple-darki">
                Destinatátio
              </strong>
              <p className="text-lavender-gray">Diego Fernandes</p>
            </div>
            <div className="space-y-2">
              <strong className="uppercase text-[0.625rem] text-purple-darki">
                Endereço
              </strong>
              <div>
                <p className="text-lavender-gray">
                  Rua Guilherme Gemballa, 260
                </p>
                <p className="text-lavender-gray">Jardim América, SC</p>
                <p className="text-lavender-gray">89 168-000</p>
              </div>
            </div>
          </section>
          <section className="px-4 py-6 rounded bg-white">
            <div className="flex items-center gap-3">
              <InfoIcon />
              <h3 className="text-[1.375rem] text-purple-dark">Situação</h3>
            </div>
            <div className="flex justify-between pt-8">
              <div className="space-y-1.5">
                <div className="space-y-2">
                  <strong className="uppercase text-[0.625rem] text-purple-darki">
                    Status
                  </strong>
                  <p className="m-0 text-lavender-gray">Aguardando</p>
                </div>
                <div className="pr-8">
                  <strong className="uppercase text-[0.625rem] text-purple-darki">
                    Data de Retirada
                  </strong>
                  <p className="text-lavender-gray">--/--/----</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div>
                  <strong className="uppercase text-[0.625rem] text-purple-darki">
                    Postado em
                  </strong>
                  <p className="text-lavender-gray">01/07/2020</p>
                </div>
                <div className="pr-8">
                  <strong className="uppercase text-[0.625rem] text-purple-darki">
                    Data de Entrega
                  </strong>
                  <p className="text-lavender-gray">--/--/----</p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <span />
        <Action
          className="pt-40"
          buttonContent="Retirar pacote"
          modalContent="Pacote retirado."
        />
      </main>
    </div>
  );
}
