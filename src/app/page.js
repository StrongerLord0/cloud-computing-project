"use client";
import React from "react";
import Image from 'next/image';
import boxPNG from '../images/bOx.png';
import { motion } from 'framer-motion';

export default function Home() {
    return (
        <motion.div
            className="absolute w-screen h-screen bg-white"
            initial={{ backgroundColor: "rgba(255, 255, 255, 1)" }} // Color blanco inicial con opacidad total
            animate={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
            transition={{ ease: 'easeInOut', duration: 0.9 }} // Duración de la transición en segundos
        >
            <motion.div
                className="flex w-screen h-screen flex-col bg-background-landing bg-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: 'easeInOut', duration: 1.2 }}
            >
                <div className="flex w-full h-1/6 items-center justify-items-start">
                    <div className="pt-5 pr-5 pl-5 h-5/6 w-2/3 ml-auto hidden lg:flex">
                        <Image src={boxPNG} className="flex w-auto h-full max-w-xs invert opacity-75" />
                    </div>
                    <nav className="w-full lg:w-1/3 ml-auto flex items-center">
                        <ul className="w-full lg:w-full flex justify-evenly">
                            <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><a href="#info">¿Qué hace?</a></li>
                            <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><a href="#service">Servicio</a></li>
                            <li className="font-normal leading-relaxed font-raleway text-gray-300 text-base"><a href="#contact">Contacto</a></li>
                        </ul>
                    </nav>
                </div>
                <div className="flex w-full h-2/3 items-center">
                    <div className="flex w-full flex-col text-center text-white">
                        <h1 className="text-4xl font-normal font-raleway text-gray-300">ByOx</h1>
                        <p className="text-md font-normal leading-relaxed font-raleway text-gray-300">Build your Own eXperience.</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
