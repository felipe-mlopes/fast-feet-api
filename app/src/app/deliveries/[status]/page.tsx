import { getOrdersDone, getOrdersPending } from "@/data/actions/orders";
import { logoutAction } from "@/data/actions/login";

import { OrdersProps } from "@/data/types/orders";

import { Card } from "@/components/Card";
import { ButtonStatus } from "@/components/ButtonStatus";

import { ExistIcon } from "@/components/icons/ExistIcon";
import { PinIcon } from "@/components/icons/PinIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";

export default async function Deliveries({
  params,
}: {
  params: { status: "pending" | "done" };
}) {
  const { ordersPending } = await getOrdersPending("cidadela");
  const { ordersDone } = await getOrdersDone("cidadela");

  return (
    <div className="flex flex-col justify-between items-center mt-20 relative min-h-screen lg:grid lg:grid-col-2 lg:grid-row-3 lg:justify-normal">
      <header className="space-y-8 w-full px-6 pb-16">
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-lilac-smooth">
            <p>Bem vindo,</p>
            <p>Tiago Luchtenberg</p>
          </div>
          <form action={logoutAction}>
            <button type="submit">
              <ExistIcon />
            </button>
          </form>
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
      <main className="px-6 pt-[3.25rem] pb-8 w-full min-h-screen bg-gray-light">
        {params.status === "pending" && (
          <>
            <div className="flex items-center gap-5 text-ligth-slate-gray">
              <span className="content=[''] w-1/3 h-[1px] bg-bluish-gray" />
              <p className="text-nowrap">
                {ordersPending.length > 1
                  ? `${ordersPending.length} entregas`
                  : `${ordersPending.length} entrega`}
              </p>
              <span className="content=[''] w-1/3 h-[1px] bg-bluish-gray" />
            </div>
            <div className="space-y-4 pt-4">
              {ordersPending.map((order: OrdersProps) => {
                return (
                  <Card
                    key={order.id}
                    id={order.id}
                    title={order.title}
                    createdAt={order.createdAt}
                    status={order.status}
                  />
                );
              })}
            </div>
          </>
        )}
        {params.status === "done" && (
          <>
            <div className="flex items-center gap-5 text-ligth-slate-gray">
              <span className="content=[''] w-1/3 h-[1px] bg-bluish-gray" />
              <p className="text-nowrap">
                {ordersDone.length > 1
                  ? `${ordersDone.length} entregas`
                  : `${ordersDone.length} entrega`}
              </p>
              <span className="content=[''] w-1/3 h-[1px] bg-bluish-gray" />
            </div>
            <div className="space-y-4 pt-4">
              {ordersDone.map((order: OrdersProps) => {
                return (
                  <Card
                    key={order.id}
                    id={order.id}
                    title={order.title}
                    createdAt={order.createdAt}
                    status={order.status}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
      <ButtonStatus status={params.status} />
    </div>
  );
}
