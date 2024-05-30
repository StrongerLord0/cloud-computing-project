"use client"
import React from "react"
import {signIn} from "next-auth/react"

export default function SignInPage() {
    return (
    <div className="flex w-screen h-screen flex-col bg-cover items-center"
            style={{ background: "radial-gradient(37.24% 60.39% at 53.49% 33.24%, #0E0F12 0%, #08090B 22%, #000 86.5%, #000 89%)" }}>
        <div className="flex w-full h-32 items-center justify-items-start bg-transparent">
            <img src="/bOx.png" className="flex w-auto h-2/3 max-w-xs invert opacity-75" />
        </div>
        <div className="w-2/3" style={{background: "black"}}>
            <div className="w-full h-32 text-xl m-12">Inicio de Sesión</div>
            
            <div className="flex w-full h-auto justify-start ml-12">
                <button className="w-auto h-12" onClick={() => signIn("google", {callbackUrl: "/"})}>Iniciar Sesión con Google</button>
            </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-auto pr-8 bg-transparent">
            <div className="flex w-full h-32 items-center justify-end bg-transparent">
                Build your Own eXperience
            </div>
        </div>
    </div>
    )
}

