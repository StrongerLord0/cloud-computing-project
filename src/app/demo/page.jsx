"use client"
import { motion } from 'framer-motion';
import Navigation from "../../components/navigation"

export default function WhatDoes() {
    return (
        <div
            className="flex w-screen h-screen flex-col bg-cover items-center"
            style={{ background: "radial-gradient(37.24% 60.39% at 53.49% 33.24%, #0E0F12 0%, #08090B 22%, #000 86.5%, #000 89%" }}
        >
            <Navigation />

            <motion.div
                className="flex w-full h-5/6 mt-2 flex-wrap items-center text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: 'easeInOut', duration: 1.2 }}
            >
                <div className="flex w-full h-3/5 flex-col text-center text-white items-center justify-center">
                    <p className="w-1/3 text-xl font-extralight leading-relaxed font-raleway text-gray-300">
                        ByOx tiene una misión principal, darte la importancia que te mereces.
                    </p>
                        <p className="w-1/3 text-xl font-extralight leading-relaxed font-raleway text-gray-300">
                        Tu experiencia como usuario, si importa.
                    </p>
                    <p className="w-1/3 text-xl font-extralight leading-relaxed font-raleway text-gray-300">
                        Tu manera de sentirte, si importa.
                    </p>
                </div>
                <div className="flex w-full h-2/5 text-center overflow-hidden text-white justify-center items-end">
                    <img className="w-2/3 h-full object-contain object-center grayscale rounded-3xl" src="/emotions.png" />
                </div>
            </motion.div>
        </div>
    )
}