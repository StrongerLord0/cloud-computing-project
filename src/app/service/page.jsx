"use client"
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from "../../components/navigation"
import {useSession} from 'next-auth/react'

export default function About() {

    const { data: session, status } = useSession();
    const videoRef = useRef(null);
    const [emotion, setEmotion] = useState('Toma una foto para analizarla...')

    const takePhotoAndSend = () => {
        if (videoRef.current && videoRef.current.readyState === 4) { // Asegurarse de que el video esté listo

            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(blob => {
                const file = new File([blob], "photo.png", { type: "image/png" });

                if (file.type.match('image.*')) {
                    const formData = new FormData();
                    formData.append("file", file);
                    fetch("/api/analyze", {
                        method: "POST",
                        body: formData,
                    })
                        .then(response => {
                            if (!response.ok) {
                                if (response.status === 400) {
                                    // Manejo específico para el error 400, por ejemplo, establecer un estado.
                                    return; // Detiene la ejecución adicional para este caso.
                                }
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data) {
                                if (!data.error) {
                                    if(status === 'authenticated'){
                                        fetch('/api/statistics', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ user: session.user._id, emotion: data.result[0].dominant_emotion, date: new Date().toISOString() })
                                        })
                                            .then(response => response.json())
                                            .then(data => {
                                                console.log('Success:', data);
                                            })
                                            .catch((error) => {
                                                console.error('Error:', error);
                                            });
                                    }
                                    
                                } else {
                                    setEmotion(data.error);
                                }
                                if (data.result[0].dominant_emotion != 'No face detected...') {
                                    videoRef.current.pause();
                                }
                            }
                            else {
                            }
                        })
                        .catch(error => {
                            console.error('Fetch error:', error);
                        });
                } else {
                }
            }, 'image/png');
        }
    }

    const initializeCamera = () => {
        videoRef.current.play();
        setEmotion('Toma una foto para analizarla...');
    };

    useEffect(() => {
        const videoConstraints = {
            facingMode: 'user',
        };

        const videoContainer = document.getElementById('video-container');
        if (videoContainer && videoContainer.childElementCount === 0) {
            navigator.mediaDevices.getUserMedia({ video: videoConstraints })
                .then(stream => {
                    const video = document.createElement('video');
                    video.srcObject = stream;
                    video.play();
                    video.style.width = '100%';
                    video.style.height = '100%';
                    video.style.objectFit = 'cover';
                    videoContainer.innerHTML = '';
                    videoContainer.appendChild(video);

                    videoRef.current = video;
                })
                .catch(error => {
                    console.error('Error accessing the camera:', error);
                });
        }
    }, []);

    return (
        <div
            className="flex w-screen h-screen flex-col bg-cover items-center"
            style={{ background: "radial-gradient(37.24% 60.39% at 53.49% 33.24%, #020A20 0%, #010309 59.81%, #000 100%, #000 100%)" }}
        >
            <div className="flex w-full h-1/6 items-center justify-items-start">
                <Navigation />
            </div>
            <motion.div
                className="flex w-full h-5/6 items-center text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: 'easeInOut', duration: 1.2 }}
            >
                <div className="flex w-1/3 h-4/5 flex-col text-center text-white items-center">
                    <div id="video-container" className="flex aspect-[3/4] overflow-hidden items-center text-center rounded-lg">

                    </div>
                    {emotion === 'No face detected...' || emotion === 'Toma una foto para analizarla...' || emotion === '' ?
                        <button onClick={takePhotoAndSend} className="mt-4 py-2 px-4 bg-gray-900 text-white leading-relaxed font-raleway rounded-lg shadow-md hover:bg-gray-700">
                            Tomar foto y analizar
                        </button>
                        :
                        <button onClick={initializeCamera} className="mt-4 py-2 px-4 bg-gray-900 text-white leading-relaxed font-raleway rounded-lg shadow-md hover:bg-gray-700">
                            Reinicar cámara
                        </button>
                    }
                </div>
                <div className="flex w-2/3 h-full flex-col text-center text-white items-center">
                    <div className="flex w-5/6 justify-end pb-3">
                        <div className="flex h-full overflow-hidden items-center text-center text-2xl text-gray-300">
                            {emotion}
                        </div>
                    </div>
                    <div className="flex w-5/6 h-3/4 overflow-auto items-center text-center">
                        <div className="flex w-full flex-col text-md font-extralight leading-relaxed font-raleway text-gray-300">
                            <p className="flex w-full justify-start text-left mt-10 mb-10">
                                Espacio para webscraping
                            </p>
                            <p className="flex w-full justify-start text-left mt-10 mb-10">
                                Espacio para webscraping
                            </p>
                            <p className="flex w-full justify-start text-left mt-10 mb-10">
                                Espacio para webscraping
                            </p>
                            <p className="flex w-full justify-start text-left mt-10 mb-10">
                                Espacio para webscraping
                            </p>
                            <p className="flex w-full justify-start text-left mt-10 mb-10">
                                Espacio para webscraping
                            </p>
                            <p className="flex w-full justify-start text-left mt-10 mb-10">
                                Espacio para webscraping
                            </p>
                            <p className="flex w-full justify-start text-left mt-10 mb-10">
                                Espacio para webscraping
                            </p>
                        </div>
                        {/* Aquí puedes agregar el contenido adicional que será scrolleable */}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}