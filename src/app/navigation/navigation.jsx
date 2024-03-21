'use-client'
import React from "react";
import Image from 'next/image';
import boxPNG from '../../images/bOx.png';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from "next-auth/react";

export default function Navigation({ onChangeContent }) {

    const { data: session, status } = useSession();

    return (
        <>
            <div className="pt-5 pr-5 pl-5 h-5/6 w-2/3 ml-auto hidden lg:flex">
                <button>
                    <Image src={boxPNG} onClick={() => onChangeContent('landing')} className="flex w-auto h-full max-w-xs invert opacity-75" />
                </button>
            </div>
            <nav className="w-full lg:w-1/3 ml-auto flex items-center">
                <ul className="w-full lg:w-full flex justify-evenly">
                    <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><button onClick={() => onChangeContent('info')}>¿Qué hace?</button></li>
                    <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><button onClick={() => onChangeContent('service')}>Información</button></li>
                    <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><button onClick={() => onChangeContent('contact')}>Contacto</button></li>
                    {status === "authenticated" ? (
                        <div>
                            <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><button onClick={() => onChangeContent('table')}>{session.user.name}</button></li>
                            <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><button onClick={() => signOut()}>Cerrar Sesión</button></li>
                        </div>
                    ) : (
                        <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><button onClick={() => signIn()}>Iniciar Sesión</button></li>
                    )}
                </ul>
            </nav>
        </>
    )
}