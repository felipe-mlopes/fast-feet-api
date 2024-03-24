import Link from "next/link";

import { Action } from "@/components/Action";
import {
  getOrderByDetails,
  OrdersProps,
  RecipientProps,
} from "@/actions/orders";

import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { FolderIcon } from "@/components/icons/FolderIcon";
import { InfoIcon } from "@/components/icons/InfoIcon";

export default async function DeliveryDetails({
  params,
}: {
  params: { status: string; id: string };
}) {
  const { order, recipient } = await getOrderByDetails(params.id);

  const { status, city, neighborhood, createdAt, picknUpAt, deliveryAt } =
    order as OrdersProps;
  const { name, address, zipcode } = recipient as RecipientProps;

  return (
    <div className="h-screen overflow-hidden bg-gray-light">
      <header className="flex items-center justify-start gap-24 pl-5 pt-14 pb-12 relative bg-indigo-blue">
        <Link href={`/deliveries/${params.status}`}>
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
              <p className="text-lavender-gray">{name}</p>
            </div>
            <div className="space-y-2">
              <strong className="uppercase text-[0.625rem] text-purple-darki">
                Endereço
              </strong>
              <div>
                <p className="text-lavender-gray">{address}</p>
                <p className="text-lavender-gray">{city}, SC</p>
                <p className="text-lavender-gray">{zipcode}</p>
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
                  <p className="m-0 text-lavender-gray">{status}</p>
                </div>
                <div className="pr-8">
                  <strong className="uppercase text-[0.625rem] text-purple-darki">
                    Data de Retirada
                  </strong>
                  <p className="text-lavender-gray">
                    {!!order ? picknUpAt : "--/--/----"}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div>
                  <strong className="uppercase text-[0.625rem] text-purple-darki">
                    Postado em
                  </strong>
                  <p className="text-lavender-gray">
                    {" "}
                    {!!order ? createdAt : "--/--/----"}
                  </p>
                </div>
                <div className="pr-8">
                  <strong className="uppercase text-[0.625rem] text-purple-darki">
                    Data de Entrega
                  </strong>
                  <p className="text-lavender-gray">
                    {!!order ? deliveryAt : "--/--/----"}
                  </p>
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
