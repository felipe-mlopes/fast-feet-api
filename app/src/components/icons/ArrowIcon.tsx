import { SVGProps } from "react";

interface IconProps extends SVGProps<SVGPathElement> {
  side: "left" | "right";
}

export function ArrowIcon({ side, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={`${side === "left" ? "rotate-180" : ""}`}
    >
      <g clipPath="url(#clip0_14016_27)">
        <path d="M16.01 11H4V13H16.01V16L20 12L16.01 8V11Z" {...props} />
      </g>
      <defs>
        <clipPath id="clip0_14016_27">
          <path
            d="M0 0H24V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V0Z"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
