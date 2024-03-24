"use client";

import { HTMLAttributes, useState } from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ActionProps extends HTMLAttributes<HTMLDivElement> {
  buttonContent: string;
  modalContent: string;
  isDisable?: boolean;
}

export function Action({
  buttonContent,
  modalContent,
  isDisable,
  ...props
}: ActionProps) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleModalClose = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div {...props}>
      <Button content={buttonContent} disabled={isDisable} />
      <Modal
        type="package"
        content={modalContent}
        isDone={false}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
