"use client"
import React from "react";
import { motion } from 'framer-motion';
import Navigation from "../../components/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Profile() {

  const { data: session, status } = useSession();

  return (
    <>
      <div
        className="flex w-screen h-screen flex-col bg-cover items-center"
        style={{ background: "radial-gradient(37.24% 60.39% at 53.49% 33.24%, #020A20 0%, #010309 59.81%, #000 100%, #000 100%)" }}
      >
        <div className="flex w-full h-1/6 items-center justify-items-start">
          <Navigation />
        </div>
        <motion.div
          className="flex w-full h-full items-center text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: 'easeInOut', duration: 1.2 }}
        >
          <div className="flex w-1/3 h-4/5 flex-col text-center overflow-hidden text-white items-center justify-center border-r-gray-500 border-r-2">
            {session ? (
              <>
                <img src={session.user.image.substring(0, session.user.image.lastIndexOf("="))} className="flex w-1/3 aspect-square rounded-3xl" />
                <p className="w-2/3 pt-10 text-md font-extralight leading-relaxed font-raleway text-gray-300">
                  {session.user.email}
                </p>
                <p className="w-2/3 pt-4 text-md font-extralight leading-relaxed font-raleway text-gray-300">
                  {session.user.name}
                </p>
                <p className="w-2/3 pt-4 text-md font-extralight leading-relaxed font-raleway text-gray-300">
                  {'Expira el ' + new Date(session.expires).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
              </>
            ) : (<></>)
            }
            <div className="flex w-full gap-5 mt-4 items-center justify-center">
              <button onClick={ () => { signOut({ callbackUrl: '/', redirect: true })}} className="w-auto py-2 px-3 bg-red-700 text-white leading-relaxed font-raleway rounded-lg shadow-md hover:bg-red-900">
                Cerrar Sesión
              </button>
              {session && session.user.email === ("adan10104334@gmail.com" || "adricoque.coqa@gmail.com") ?
                <div className="w-auto py-2 px-3 bg-blue-700 text-white leading-relaxed font-raleway rounded-lg shadow-md hover:bg-blue-900">
                  <Link className="w-full" href="/admin">Administrador</Link>
                </div>
                : <>
                </>}
            </div>
          </div>
          <div className="flex w-2/3 h-1/3 flex-col text-center text-white items-center">

          </div>
        </motion.div>
      </div>
    </>
  )
}