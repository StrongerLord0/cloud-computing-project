"use client"
import { motion } from 'framer-motion';
import Navigation from "../../components/navigation"
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function Profile() {
    const { setSharedData } = useAppContext();
    const { data: session, status } = useSession();
    const [users, setUsers] = useState([]);

    const handleClick = (user) => {
        setSharedData(user);
    }

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
            style={{ background: "radial-gradient(37.24% 60.39% at 53.49% 33.24%, #0E0F12 0%, #08090B 22%, #000 86.5%, #000 89%" }}
        >
            <Navigation />

            <motion.div
                className="flex w-1/2 h-2/3 items-center text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: 'easeInOut', duration: 1.2 }}
            >
                {session && session.user.email === ("adan10104334@gmail.com" || "adricoque.coqa@gmail.com") ? (
                    <div className="flex w-full h-full flex-col text-center text-white">
                        <h1 className="flex text-4xl font-normal font-raleway text-gray-300">Seleccione un usuario ({users.length})</h1>
                        <div className="flex w-full h-full flex-col text-center text-white overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
                            <table>
                                {users &&
                                    users.map(user => (
                                        <Link href='profile'>
                                            <button className='w-full h-1/6 flex flex-wrap items-center' key={user._id} onClick={() => handleClick(user)}>
                                            <div className='w-4/5 h-full flex flex-wrap justify-center items-center'>
                                                <div className="flex w-1/2 h-full">{user.name}</div>
                                                <div className='flex w-1/2 h-full'>{user.email}</div>
                                            </div>
                                            <div
                                                style={{
                                                    '--image-url': `url(${user.image})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    height: '100px',
                                                    width: '100px'
                                                }}
                                                className="flex items-end w-1/3 justify-end text-end bg-[image:var(--image-url)]"
                                            />
                                        </button>
                                        </Link>
                                    ))}
                        </table>
                    </div>
                    </div>
    ) : (
        <></>
    )
}
            </motion.div >
        </div >
    )
}