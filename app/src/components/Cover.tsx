import Image from "next/image";

export function Cover() {
  return (
    <Image
      src={"/img/FF.png"}
      alt="imagem de fundo"
      width={200}
      height={200}
      className="absolute top-0 left-0 z-[-1]"
    />
  );
}
