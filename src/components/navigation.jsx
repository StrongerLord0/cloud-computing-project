'use-client'

import { usePathname } from 'next/navigation'
import React from "react";
import Link from "next/link";
import Image from 'next/image';
import boxPNG from '../../public/bOx.png';
import { signIn } from 'next-auth/react';
import { useSession } from "next-auth/react";
import { motion } from 'framer-motion'

const navItemVariants = {
    hidden: { opacity: 0.5, scale: 1 },
    visible: { opacity: 1, scale: 1 },
};

export default function Navigation() {

    const pathname = usePathname();
    const { data: session, status } = useSession();

    return (
        <div className="flex w-full h-32 items-center justify-items-start">
            <div className="pt-2 pb-2 pl-5 h-5/6 w-2/3 ml-auto hidden lg:flex">
                <button>
                    <Link href="/">
                        <Image src={boxPNG} className="flex w-auto h-full max-w-xs invert opacity-75" />
                    </Link>
                </button>
            </div>
            <nav className="w-full lg:w-1/3 ml-auto flex items-center">
                <ul className="w-full lg:w-full flex justify-evenly items-center">
                    <motion.li
                        className={`font-normal leading-relaxed font-raleway text-gray-300 text-base ${pathname === '/demo' ? 'border-b-2 border-gray-300' : ''}`}
                        initial="hidden"
                        animate={pathname === '/demo' ? 'visible' : 'hidden'}
                        variants={navItemVariants}
                        transition={{ duration: 0.3 }}
                    >
                        <Link className="p-2" href="/demo">Propósito</Link>
                    </motion.li>
                    <motion.li
                        className={`font-normal leading-relaxed font-raleway text-gray-300 text-base ${pathname === '/service' ? 'border-b-2 border-gray-300' : ''}`}
                        initial="hidden"
                        animate={pathname === '/service' ? 'visible' : 'hidden'}
                        variants={navItemVariants}
                        transition={{ duration: 0.3 }}
                    >
                        <Link className="p-2" href="/service">Servicio</Link>
                    </motion.li>
                    {status === "authenticated" ? (
                        <motion.li
                            className="font-normal leading-relaxed font-raleway text-gray-300 text-base"
                            initial="hidden"
                            animate={pathname === '/profile' ? 'visible' : 'hidden'}
                            variants={navItemVariants}
                            transition={{ duration: 0.3 }}
                        >
                            <Link className="w-full" href="/profile">
                                <motion.img
                                    className="rounded-full w-1/2"
                                    src={session.user.image}
                                    initial={{ opacity: 0.5, scale: 1 }}
                                    animate={{ opacity: pathname === '/profile' ? 1 : 0.5, scale: pathname === '/profile' ? 1 : 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Link>
                        </motion.li>
                    ) : (
                        <motion.li
                            className="font-normal leading-relaxed font-raleway text-gray-300 text-base opacity-50"
                            initial="hidden"
                            animate="visible"
                            variants={navItemVariants}
                            transition={{ duration: 0.3 }}
                        >
                            <button onClick={() => signIn()}>Iniciar Sesión</button>
                        </motion.li>
                    )}
                </ul>
            </nav>
        </div>
    );
}