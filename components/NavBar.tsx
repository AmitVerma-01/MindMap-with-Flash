import Image from "next/image";
import logo from '@/public/logo.png';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";


export default function NavBar() {
    return (
        <nav className="h-16 w-full text-white font-medium bg-[#0F1438] flex items-center justify-between px-5">
            <div className="flex justify-center items-center font-mono">
                <Image src={logo} alt="MindMapWithFlash" width={50}  />
                <div className="flex flex-col leading-5">
                    <span>MindMap</span>
                    <span className="ml-5">WithFlash.</span>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex gap-x-3 mr-3 ">
                    <Link href={'/'}>
                        Home
                    </Link>
                    <Link href={'/dashboard'}>
                        Dashboard
                    </Link>
                    <Link href={'/about'}>
                        About
                    </Link>
                    <Link href={'/pricing'}>
                        Pricing
                    </Link>
                </div>
                <div className=" flex gap-x-2  items-center">
                    <SignedOut>
                        <div className="bg-[#2B74AB] rounded-md p-1">
                            <SignInButton />
                        </div>
                    </SignedOut>
                    <SignedOut>
                        <div className="bg-[#2B74AB] rounded-md p-1">
                            <SignUpButton/>
                        </div>
                    </SignedOut>
                </div>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </nav>
    );
}
