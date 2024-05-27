"use client";
import React, { useEffect } from "react";
import { motion } from 'framer-motion';
import Navigation from "../components/navigation"
import { useState } from "react";

export default function Home() {
    return (
        <motion.div
            className="absolute w-screen h-screen bg-white"
            initial={{ backgroundColor: "rgba(255, 255, 255, 1)" }} // Color blanco inicial con opacidad total
            animate={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
            transition={{ ease: 'easeInOut', duration: 0.9 }} // Duración de la transición en segundos
        >
            <motion.div
                className="flex w-screen h-screen flex-col bg-cover items-center"
                style={{ background: "radial-gradient(37.24% 60.39% at 53.49% 33.24%, #020A20 0%, #010309 59.81%, #000 100%, #000 100%)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: 'easeInOut', duration: 1.2 }}
            >
                    <Navigation />
                <div className="flex w-1/2 h-full mb-20 items-center text-center">
                    <div className="flex w-full flex-col text-center text-white">
                        <h1 className="text-4xl font-normal font-raleway text-gray-300">ByOx</h1>
                        <p className="text-md font-normal leading-relaxed font-raleway text-gray-300">Build your Own eXperience.</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}