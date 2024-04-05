'use-client'
import React from "react";
import Link from "next/link";
import Image from 'next/image';
import boxPNG from '../../public/bOx.png';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from "next-auth/react";

export default function Navigation() {

    const { data: session, status } = useSession();

    return (
        <>
            <div className="pt-5 pr-5 pl-5 h-5/6 w-2/3 ml-auto hidden lg:flex">
                <button>
                    <Link href="/">
                        <Image src={boxPNG} className="flex w-auto h-full max-w-xs invert opacity-75" />
                    </Link>
                </button>
            </div>
            <nav className="w-full lg:w-1/3 ml-auto flex items-center">
                <ul className="w-full lg:w-full flex justify-evenly">
                    <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><Link href="/demo">¿Qué hace?</Link></li>
                    <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><Link href="/about">Información</Link></li>
                    <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><Link href="/contact">Contacto</Link></li>
                    {status === "authenticated" ? (
                        <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><Link href="/profile">{session.user.name}</Link></li>
                    ) : (
                        <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><button onClick={() => signIn()}>Iniciar Sesión</button></li>
                    )}
                </ul>
            </nav>
        </>
    )
}