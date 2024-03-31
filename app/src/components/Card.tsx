import Link from "next/link";
import dayjs from "dayjs";

import { OrdersProps } from "@/data/types/orders";

import { transformStatus } from "@/utils/transform-status";

import { StatusSteps } from "./StatusSteps";

import { ArrowIcon } from "./icons/ArrowIcon";
import { PackageIcon } from "./icons/PackageIcon";

export function Card({ id, title, createdAt, status }: OrdersProps) {
  const createAtOnData = dayjs(createdAt).format("DD/MM/YYYY");

  const statusParams = transformStatus(status);

  return (
    <div className="space-y-6 bg-white rounded shadow-card">
      <div className="space-y-8 px-4 pt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <PackageIcon />
            <h4 className="text-[1.375rem] text-purple-dark capitalize">
              {title}
            </h4>
          </div>
          <p className="text-[0.625rem] font-medium text-lavender-gray">
            {createAtOnData}
          </p>
        </div>
        <StatusSteps currentStatus={status} />
      </div>
      <Link
        href={`/deliveries/${statusParams}/${id}`}
        className="flex justify-between items-center p-4 w-full bg-yellow-slow"
      >
        <span className="font-medium text-purple-dark">Detalhes</span>
        <ArrowIcon side="right" className="fill-lavender-gray" />
      </Link>
    </div>
  );
}
