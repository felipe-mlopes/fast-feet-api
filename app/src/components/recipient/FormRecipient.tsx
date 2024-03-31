"use client";

import { FormStateTypes } from "@/types";
import {
  DetailedHTMLProps,
  FormHTMLAttributes,
  PropsWithChildren,
} from "react";
import { useFormState } from "react-dom";

type HTMLFormProps = DetailedHTMLProps<
  FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

interface FormRecipientProps
  extends PropsWithChildren<Omit<HTMLFormProps, "action">> {
  action: (
    prevState: FormStateTypes,
    formData: FormData
  ) => Promise<FormStateTypes>;
}

export function FormRecipient({ children, action }: FormRecipientProps) {
  const [state, formAction] = useFormState(action, {
    data: null,
    error: null,
  });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="">Nome</label>
        <div>
          <input
            type="text"
            name="clientName"
            id="clientName"
            placeholder="Digite o nome do cliente"
            className="outline-none text-base font-normal text-purple-dark bg-gray-light appearance-none rounded p-2"
          />
        </div>
      </div>
      <div>
        <label htmlFor="">E-mail</label>
        <div>
          <input
            type="email"
            name="clientEmail"
            id="clientEmail"
            placeholder="Digite o email do cliente"
            className="outline-none text-base font-normal text-purple-dark bg-gray-light appearance-none rounded p-2"
          />
        </div>
      </div>
      <div>
        <label htmlFor="">CEP</label>
        <div>
          <input
            type="number"
            name="zipcode"
            id="zipcode"
            placeholder="Digite o CEP do cliente"
            className="outline-none text-base font-normal text-purple-dark bg-gray-light appearance-none rounded p-2"
          />
        </div>
      </div>
      <div>
        <label htmlFor="">Endereço Completo</label>
        <div>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Digite o Endereço Completo do cliente"
            className="w-full lg:w-auto outline-none text-base font-normal text-purple-dark bg-gray-light appearance-none rounded p-2"
          />
        </div>
      </div>
      <div>
        <label htmlFor="">Bairro</label>
        <div>
          <input
            type="text"
            name="neighborhood"
            id="neighborhood"
            placeholder="Digite o Bairro do cliente"
            className="outline-none text-base font-normal text-purple-dark bg-gray-light appearance-none rounded p-2"
          />
        </div>
      </div>
      <div>
        <label htmlFor="">Cidade</label>
        <div>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="Digite o Cidade do cliente"
            className="outline-none text-base font-normal text-purple-dark bg-gray-light appearance-none rounded p-2"
          />
        </div>
      </div>
      <div>
        <label htmlFor="">UF</label>
        <div>
          <input
            type="text"
            name="state"
            id="state"
            placeholder=""
            className="max-w-14 outline-none text-base font-normal text-purple-dark bg-gray-light appearance-none rounded p-2"
          />
        </div>
      </div>
      {children}
    </form>
  );
}
