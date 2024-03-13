"use client";

import { useState } from "react";

import { ErrorIcon } from "./icons/ErrorIcon";

export function ModalError() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      role="alertdialog"
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-50"
    >
      <div className="w-full shadow-lg">
        <div className="flex flex-col items-center justify-between gap-6">
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <ErrorIcon />
          </button>
          <p className="px-28 text-center font-medium text-2xl text-gray-light">
            Senha ou CPF incorretos.
          </p>
        </div>
      </div>
    </div>
  );
}
