import Link from "next/link";

interface ButtonStatusProps {
  status?: "pending" | "done";
}

export function ButtonStatus({ status }: ButtonStatusProps) {
  return (
    <footer className="flex w-full sticky bottom-0 z-10">
      <Link
        href={"/deliveries/pending"}
        className={`px-[4.5rem] pt-5 pb-[2.125rem] bg-gray-light font-medium text-lavender-gray 
        ${
          status === "pending" &&
          "bg-white border-t-4 border-t-orange-light text-indigo-blue"
        }
        `}
      >
        Pendentes
      </Link>
      <Link
        href={"/deliveries/done"}
        className={`px-[4.5rem] pt-5 pb-[2.125rem] bg-gray-light font-medium text-lavender-gray 
        ${
          status === "done" &&
          "bg-white border-t-4 border-t-orange-light text-indigo-blue"
        }
        `}
      >
        Feitas
      </Link>
    </footer>
  );
}
