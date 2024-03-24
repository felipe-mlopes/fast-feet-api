"use client";

import { useEffect, useState } from "react";

interface StatusStepsProps {
  currentStatus: string;
}

export function StatusSteps({ currentStatus }: StatusStepsProps) {
  const steps = ["aguardando", "retirado", "entregue"];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const status = ["WAITING", "PICKN_UP", "DONE"];
    const whichStep = status.findIndex((item) => item === currentStatus);

    setCurrentStep(whichStep);
  }, [currentStatus]);

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
