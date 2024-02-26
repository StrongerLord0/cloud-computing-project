import React from "react";
import Image from 'next/image';
import boxPNG from '../images/bOx.png';
import backgroundImage from '../images/byOxbg.jpg';

export default function Home() {
    return (
        <div className="w-screen h-screen flex-col" style={{ backgroundImage: "url('../images/byOxbg.jpg')", backgroundSize: "100% 100%" }}>
            <div className="w-1/10 h-1/6 flex">
                <div className="flex pt-5 pr-5 pl-5 h-7/8 w-auto">
                    <Image src={boxPNG} className="flex w-auto h-4/5 max-w-xs invert opacity-75" />
                </div>
                <nav className="w-9/10 ml-auto flex items-center">
                    <ul className="flex gap-x-10 justify-between px-10">
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
        </div>
    );
}
