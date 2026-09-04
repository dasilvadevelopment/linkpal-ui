import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="mx-auto h-screen border">
            <form action="">
                <input placeholder="username" type="text" />
                <input placeholder="e-mail" type="text" />
                <input placeholder="password" type="password" />
                <input placeholder="confirm password" type="password" />
            </form>
        </div>
    );
}
