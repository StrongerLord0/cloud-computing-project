"use client"
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from "../../components/navigation"

export default function About() {

    const apiUrl = process.env.IA_URL;
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [emotion, setEmotion] = useState('loading...')

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
                    fetch("https://api.babyday.studio/analyze", {
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
                            if(data){
                                if(!data.error){
                                    setEmotion(data.result[0].dominant_emotion);
                                } else {
                                    setEmotion(data.error);    
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

    useEffect(() => {

        const interval = setInterval(() => {

            takePhotoAndSend();

        }, 1000); // 3000 milisegundos = 3 segundos

        const videoConstraints = {
            facingMode: 'user',
            aspectRatio: 9 / 16,
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
                    video.style.objectFit = 'fit';
                    videoContainer.innerHTML = '';
                    videoContainer.appendChild(video);

                    videoRef.current = video;
                })
                .catch(error => {
                    console.error('Error accessing the camera:', error);
                });
        }

        // Función de limpieza para limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
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
                className="flex w-full h-2/3 items-center text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: 'easeInOut', duration: 1.2 }}
            >
                <div className="flex w-1/2 h-4/5 flex-col text-center text-white items-center">
                    <div id="video-container" className="flex w-1/2 h-full overflow-hidden items-center text-center">

                    </div>
                    <div className="flex h-1/6 overflow-hidden items-center text-center text-2xl text-gray-300">
                        {emotion}
                    </div>
                </div>
                <div className="flex w-1/2 flex-col text-center text-white items-center">
                    <p className="w-2/3 text-md font-extralight leading-relaxed font-raleway text-gray-300">
                        Esta es una muestra del uso de nuestra aplicación
                    </p>
                </div>
            </motion.div>
        </div>
    )
}