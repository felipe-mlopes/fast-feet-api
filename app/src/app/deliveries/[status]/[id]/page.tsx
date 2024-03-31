import Link from "next/link";
import dayjs from "dayjs";

import { getOrderByDetails } from "@/data/actions/orders";

import { OrdersProps } from "@/data/types/orders";
import { RecipientsProps } from "@/data/types/recipients";

import { statusEdit } from "@/utils/transform-status";
import { zipcodeMask } from "@/utils/zipcode-mask";

import { Action } from "@/components/Action";

import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { FolderIcon } from "@/components/icons/FolderIcon";
import { InfoIcon } from "@/components/icons/InfoIcon";

export default async function DeliveryDetails({
  params,
}: {
  params: { status: string; id: string };
}) {
  const { order, recipient } = await getOrderByDetails(params.id);

  const { status, city, createdAt, picknUpAt, deliveryAt } =
    order as OrdersProps;
  const { name, address, zipcode } = recipient as RecipientsProps;

  const transformedStatus = statusEdit(status);
  const transformedZipcode = zipcodeMask(zipcode);
  const createAtOnData = dayjs(createdAt).format("DD/MM/YYYY");
  const picknUpAtOnData = !!picknUpAt
    ? dayjs(picknUpAt).format("DD/MM/YYYY")
    : "--/--/----";
  const deliveryAtOnData = !!deliveryAt
    ? dayjs(deliveryAt).format("DD/MM/YYYY")
    : "--/--/----";

  return (
    <div className="min-h-screen overflow-hidden bg-gray-light">
      <header className="flex items-center justify-start gap-24 pl-5 pt-14 pb-12 relative bg-indigo-blue">
        <Link href={`/deliveries/${params.status}`}>
          <ArrowIcon side="left" className="fill-white" />
        </Link>
        <h2 className="text-[1.625rem] text-white">Detalhes</h2>
      </header>
      <main className="flex flex-col justify-around px-6 min-h-screen relative">
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
              <p className="text-lavender-gray capitalize">{name}</p>
            </div>
            <div className="space-y-2">
              <strong className="uppercase text-[0.625rem] text-purple-darki">
                Endereço
              </strong>
              <div>
                <p className="text-lavender-gray capitalize">{address}</p>
                <p className="text-lavender-gray capitalize">{city}, SC</p>
                <p className="text-lavender-gray">{transformedZipcode}</p>
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
                  <p className="m-0 text-lavender-gray capitalize">
                    {transformedStatus}
                  </p>
                </div>
                <div className="space-y-2 pr-8">
                  <strong className="uppercase text-[0.625rem] text-purple-darki">
                    Data de Retirada
                  </strong>
                  <p className="text-lavender-gray">{picknUpAtOnData}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="space-y-2">
                  <strong className="uppercase text-[0.625rem] text-purple-darki">
                    Postado em
                  </strong>
                  <p className="text-lavender-gray">{createAtOnData}</p>
                </div>
                <div className="space-y-2 pr-8">
                  <strong className="uppercase text-[0.625rem] text-purple-darki">
                    Data de Entrega
                  </strong>
                  <p className="text-lavender-gray">{deliveryAtOnData}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <span />
        <Action
          className="pt-40"
          buttonContent={
            status === "WAITING" ? "Retirar pacote" : "Confirmar entrega"
          }
          isDone={status === "DONE"}
          modalContent="Pacote retirado."
        />
      </main>
    </div>
  );
}
