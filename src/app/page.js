"use client";
import React, { useEffect } from "react";
import { motion } from 'framer-motion';
import Navigation from "./navigation/navigation"
import { useState } from "react";

export default function Home() {

    const [users, setUsers] = useState({});
    const [content, setContent] = useState('landing');

    useEffect(() => {
        getUsers() // Llama a getUsers
            .then(data => {
                setUsers(data); // Actualiza el estado users con los datos obtenidos
                console.log("consulta");
                console.log(data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        console.log(users);

    }, [content]);

    const changeContent = (newContent) => {
        setContent(newContent);
    };

    const getUsers = async () => {
        const response = await fetch('https://social.babyday.studio/api/users');
        const data = await response.json();
        return data; // Devuelve los datos en lugar de intentar cambiar el estado directamente
    }


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
                <div className="flex w-full h-1/6 items-center justify-items-start">
                    <Navigation onChangeContent={changeContent} />
                </div>
                <div className="flex w-1/2 h-2/3 items-center text-center">
                    {content === 'landing' ? (
                        <div className="flex w-full flex-col text-center text-white">
                            <h1 className="text-4xl font-normal font-raleway text-gray-300">ByOx</h1>
                            <p className="text-md font-normal leading-relaxed font-raleway text-gray-300">Build your Own eXperience.</p>
                        </div>
                    ) : content === 'info' ? (
                        <></>
                    ) : content === 'service' ? (
                        <></>
                    ) : content === 'contact' ? (
                        <></>
                    ) : content === 'table' ? (

                        <div className="flex w-full h-4/5 flex-col text-center text-white">
                            <h1 className="flex text-4xl font-normal font-raleway text-gray-300">Lista de usuarios</h1>
                            <div className="flex w-full h-full flex-col text-center text-white overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
                                <table>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td
                                                style={{
                                                    '--image-url': `url(${user.image})`,
                                                    backgroundSize: 'cover', // Asegura que la imagen cubra todo el espacio disponible
                                                    backgroundPosition: 'center', // Centra la imagen en el elemento
                                                    height: '100px', // Define la altura del elemento
                                                    width: '100px' // Define la anchura del elemento
                                                }}
                                                className="bg-[image:var(--image-url)]"
                                            />
                                        </tr>
                                    ))}
                                </table>
                            </div>
                        </div>
                    ) : <></>}
                </div>
            </motion.div>
        </motion.div>
    );
}