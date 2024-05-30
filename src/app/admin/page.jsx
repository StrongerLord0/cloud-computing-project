"use client"
import { motion } from 'framer-motion';
import Navigation from "../../components/navigation"
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';

export default function Profile() {

    const { data: session, status } = useSession();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers() // Llama a getUsers
            .then(data => {
                setUsers(data); // Actualiza el estado users con los datos obtenidos
                console.log(data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        console.log(users);

    }, []);

    const getUsers = async () => {
        const response = await fetch('/api/users', { cache: "no-store" });
        const data = await response.json();
        return data; // Devuelve los datos en lugar de intentar cambiar el estado directamente
    }

    return (
        <div
            className="flex w-screen h-screen flex-col bg-cover items-center"
            style={{ background: "radial-gradient(37.24% 60.39% at 53.49% 33.24%, #020A20 0%, #010309 59.81%, #000 100%, #000 100%)" }}
        >
            <Navigation />

            <motion.div
                className="flex w-1/2 h-full items-center text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: 'easeInOut', duration: 1.2 }}
            >
                {session && session.user.email === ("adan10104334@gmail.com" || "adricoque.coqa@gmail.com") ? (
                    <div className="flex w-full h-4/5 flex-col text-center text-white">
                        <h1 className="flex text-4xl font-normal font-raleway text-gray-300">Lista de usuarios ({users.length})</h1>
                        <div className="flex w-full h-full flex-col text-center text-white overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
                            <table>
                                {users &&
                                    users.map(user => (
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
                ) : (
                    <></>
                )}
            </motion.div>
        </div >
    )
}