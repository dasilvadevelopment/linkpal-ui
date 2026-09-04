import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto h-screen border">
      <Link href={"/register"}>Register</Link>
      <Link href={"/login"}>Login</Link>
    </div>
  );
}