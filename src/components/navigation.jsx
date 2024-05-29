'use-client'

import { usePathname } from 'next/navigation'
import React from "react";
import Link from "next/link";
import Image from 'next/image';
import boxPNG from '../../public/bOx.png';
import { signIn } from 'next-auth/react';
import { useSession } from "next-auth/react";

export default function Navigation() {

    const pathname = usePathname();
    const { data: session, status } = useSession();

    return (
        <div className="flex w-full h-24 items-center justify-items-start">
            <div className="pt-2 pb-2 pl-5 h-5/6 w-2/3 ml-auto hidden lg:flex">
                <button>
                    <Link href="/">
                        <Image src={boxPNG} className="flex w-auto h-full max-w-xs invert opacity-75" />
                    </Link>
                </button>
            </div>
            <nav className="w-full lg:w-1/3 ml-auto flex items-center">
                <ul className="w-full lg:w-full flex justify-evenly items-center">
                    <li className={`font-normal leading-relaxed font-raleway text-gray-300 text-base ${pathname === '/demo' ? 'border-b-2 border-gray-300 opacity-100' : 'opacity-50'}`}>
                        <Link className="p-2" href="/demo">Propósito</Link>
                    </li>
                    <li className={`font-normal leading-relaxed font-raleway text-gray-300 text-base ${pathname === '/service' ? 'border-b-2 border-gray-300 opacity-100' : 'opacity-50'}`}>
                        <Link className="p-2" href="/service">Servicio</Link>
                    </li>
                    {status === "authenticated" ? (
                        <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><Link className="w-full" href="/profile"><img className={`rounded-xl w-1/2 ${pathname === '/profile' ? 'opacity-100' : 'opacity-50'} `} src={session.user.image} /></Link></li>
                    ) : (
                        <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base opacity-50"><button onClick={() => signIn()}>Iniciar Sesión</button></li>
                    )}
                </ul>
            </nav>
        </div>
    )
}