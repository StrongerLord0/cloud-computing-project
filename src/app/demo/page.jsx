"use client"
import { motion } from 'framer-motion';
import Navigation from "../../components/navigation"

export default function WhatDoes() {
    return (
        <div
            className="flex w-screen h-screen flex-col bg-cover items-center"
            style={{ background: "radial-gradient(37.24% 60.39% at 53.49% 33.24%, #020A20 0%, #010309 59.81%, #000 100%, #000 100%)" }}
        >
            <Navigation />

            <motion.div
                className="flex w-full h-full mb-20 items-center text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: 'easeInOut', duration: 1.2 }}
            >
                <div className="flex w-1/2 h-full flex-col text-center overflow-hidden text-white justify-center items-center">
                    <img className="w-2/3 h-full object-cover object-center transform rounded-3xl" src="https://c.pxhere.com/images/97/ad/93c005dcd7f716ebcea0e66fd4f1-1457317.jpg!d" />
                </div>
                <div className="flex w-1/2 h-full flex-col text-center text-white items-center justify-center">
                    <p className="w-2/3 text-2xl font-extralight leading-relaxed font-raleway text-gray-300">
                        ByOx es una aplicación innovadora que utiliza tecnología de reconocimiento facial y el análisis de emociones para
                        mejorar la experiencia del usuario en la web. La aplicación aprovecha la cámara de tu dispositivo
                        para detectar tus emociones, personalizar la experiencia del usuario en base a los resultados y brindarte información
                        que podría ser de tu interés.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}