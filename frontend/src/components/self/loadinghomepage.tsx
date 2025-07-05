import Image from "next/image";

export default function LoadingHomepage() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
        <Image className="animate-out" src="/instalogo.png" alt="logo" width={50} height={50} />
    </div>
  );
}
