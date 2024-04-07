"use client"
import { motion } from 'framer-motion';
import Navigation from "../../components/navigation"

export default function WhatDoes() {
    return (
        <div
            className="flex w-screen h-screen flex-col bg-cover items-center"
            style={{ background: "radial-gradient(37.24% 60.39% at 53.49% 33.24%, #020A20 0%, #010309 59.81%, #000 100%, #000 100%)" }}
        >
            <div className="flex w-full h-1/6 items-center justify-items-start">
                <Navigation />
            </div>
            <motion.div
                className="flex w-full h-2/3 items-center text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: 'easeInOut', duration: 1.2 }}
            >
                <div className="flex w-1/2 flex-col text-center text-white">
                    <h1 className="text-4xl font-normal font-raleway text-gray-300">ByOx</h1>
                    <p className="text-md font-normal leading-relaxed font-raleway text-gray-300">Build your Own eXperience.</p>
                </div>
                <div className="flex w-1/2 flex-col text-center text-white items-center">
                    <p className="w-2/3 text-md font-extralight leading-relaxed font-raleway text-gray-300">
                        ByOx es una aplicación innovadora que utiliza tecnología de reconocimiento facial y el análisis de emociones para
                        mejorar la experiencia del usuario en la web y en la vida diaria. La aplicación aprovecha la cámara de tu dispositivo
                        para detectar tus emociones, personalizar la experiencia del usuario en base a los resultados y brindarte información
                        que podría ser de tu interés.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}