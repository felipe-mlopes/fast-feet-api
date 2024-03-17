"use client";

import { useEffect, useState } from "react";

export function StatusSteps() {
  const steps = ["aguardando", "retirado", "entregue"];
  const status = ["waiting", "pickn_up", "done"];

  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="flex justify-between">
      {steps?.map((step, i) => (
        <div
          key={i}
          className={`step-item ${
            steps.map((_, idx) => idx)[i] <= currentStep && "active"
          } ${steps.map((_, idx) => idx)[i] < currentStep && "complete"} `}
        >
          <div className="step" />
          <strong className="pt-2 uppercase text-[0.625rem] text-ligth-slate-gray">
            {step}
          </strong>
        </div>
      ))}
    </div>
  );
}
