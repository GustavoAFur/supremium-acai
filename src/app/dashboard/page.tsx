import Image from "next/image";

export default function Page() {
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <Image
        src={"/logo.png"}
        alt="Logo"
        width={300}
        height={300}
        objectFit="contain"
      />
    </div>
  );
}
