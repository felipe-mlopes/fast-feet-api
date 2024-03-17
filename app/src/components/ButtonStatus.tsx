"use client";

import { useState } from "react";

export function ButtonStatus() {
  const [currentStatus, setCurrentStatus] = useState("pending");

  return (
    <footer className="flex w-full sticky bottom-0 z-10">
      <button
        className={`px-[4.5rem] pt-5 pb-[2.125rem] bg-gray-light font-medium text-lavender-gray 
        ${
          currentStatus === "pending" &&
          "bg-white border-t-4 border-t-orange-light text-indigo-blue"
        }
        `}
        onClick={() => setCurrentStatus("pending")}
      >
        Pendentes
      </button>
      <button
        className={`px-[4.5rem] pt-5 pb-[2.125rem] bg-gray-light font-medium text-lavender-gray 
        ${
          currentStatus === "done" &&
          "bg-white border-t-4 border-t-orange-light text-indigo-blue"
        }
        `}
        onClick={() => setCurrentStatus("done")}
      >
        Feitas
      </button>
    </footer>
  );
}
