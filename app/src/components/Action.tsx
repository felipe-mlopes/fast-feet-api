"use client";

import { HTMLAttributes, useState } from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ActionProps extends HTMLAttributes<HTMLDivElement> {
  buttonContent: string;
  modalContent: string;
  isDisable?: boolean;
  isDone: boolean;
}

export function Action({
  buttonContent,
  modalContent,
  isDisable,
  isDone,
  ...props
}: ActionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {!isDone && (
        <div {...props}>
          <Button content={buttonContent} disabled={isDisable} />
          <Modal
            type="package"
            content={modalContent}
            isDone={isDone}
            isOpen={isModalOpen}
            onClose={handleModalClose}
          />
        </div>
      )}
    </>
  );
}
