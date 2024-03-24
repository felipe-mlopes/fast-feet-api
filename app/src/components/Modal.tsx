"use client";

import { ErrorIcon } from "./icons/ErrorIcon";
import { PackagePickedIcon } from "./icons/PackagePickedIcon";

interface ModalProps {
  type: "error" | "package";
  content: string;
  isDone?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function Modal({ type, content, isDone, isOpen, onClose }: ModalProps) {
  return (
    <div
      role="alertdialog"
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="w-full">
        <div className="flex flex-col items-center justify-between gap-6">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {type === "error" ? <ErrorIcon /> : <PackagePickedIcon />}
          </button>
          <span className="space-y-2">
            <h3 className="px-28 text-center font-medium text-2xl text-gray-light">
              {content}
            </h3>
            {type === "package" && isDone == false && (
              <h4 className="text-center font-normal text-xs text-gray-light">
                Só falta entregar :)
              </h4>
            )}
            {type === "package" && isDone == true && (
              <h4 className="text-center font-normal text-xs text-gray-light">
                Pacote entregue.
              </h4>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
