"use client"
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from "@/components/navigation";
import { useSession } from 'next-auth/react';
import CameraSection from './components/CameraSection';
import TweetsSection from './components/TweetsSection';
import fetchTweets from './helpers/fetchTweets'
import saveEmotionToStatistics from './helpers/fetchEmotionToStatistics'
import translateEmotion from './helpers/translateEmotion';
import transformEmotionsData from './helpers/transformEmotionsData'

export default function About() {
    const { data: session } = useSession();
    const videoRef = useRef(null);
    const [emotion, setEmotion] = useState('Toma una foto para analizarla...');
    const [emotionJson, setEmotionJson] = useState({});
    const [tweets, setTweets] = useState([]);

    const takePhotoAndSend = async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], "photo.png", { type: "image/png" });

            if (file.type.match('image.*')) {
                const formData = new FormData();
                formData.append("file", file);

                try {
                    const response = await fetch("/api/analyze", {
                        method: "POST",
                        body: formData,
                    });

                    if (response.ok) {
                        const data = await response.json();
                        handleEmotionDetection(data);
                    } else {
                        console.error('Error:', response.status);
                    }
                } catch (error) {
                    console.error('Fetch error:', error);
                }
            }
        }
    };

    const handleEmotionDetection = (data) => {
        if (data && !data.error) {
            const detectedEmotion = translateEmotion(data.result[0].dominant_emotion);
            const transformedData = transformEmotionsData(data.result[0].emotion);
            setEmotionJson(transformedData);
            setEmotion(detectedEmotion);
            saveEmotionToStatistics(data.result[0].dominant_emotion, session.user._id, new Date().toISOString());
            fetchHashtagInterpreter(data.result[0].emotion);
            console.log(data);
        } else {
            setEmotion(data.error || 'Error detecting emotion');
        }
    };

    const fetchHashtagInterpreter = async (emotions) => {
        const content = JSON.stringify(emotions);
        console.log(content);
        try {
            const response = await fetch('/api/interpreter', {
                method: 'POST',
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {
                            "role": "system",
                            "content": "Te voy a dar lo siguiente: <Pregunta1>: emotion: { angry: 0.18498216522857547, disgust: 5.97595644080684e-06, fear: 0.1841661985963583, happy: 0.2677189661189914, neutral: 98.40776920318604, sad: 1.0957077145576477, surprise: 0.0006014268819853896 }. En base a estas emociones, quiero que me sugieras hashtags que puedan ayudarme a encontrar tweets que mejoren mi estado de ánimo, como memes y cosas bonitas. Tu respuesta debe ser un arreglo JSON con hashtags alegres, positivos y motivadores. Ejemplo de la respuesta esperada: [memes, funny, happy, joy, inspiration, positivity, beautiful, calm]"
                        },
                        {
                            "role": "user",
                            "content": content
                        }
                    ]
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const fetchedTweets = await fetchTweets(data)
                await setTweets(fetchedTweets);
            } else {
                console.error('Error fetching hashtags:', response.status);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    return (
        <div
            className="flex w-screen h-screen flex-col bg-cover items-center"
            style={{ background: "radial-gradient(37.24% 60.39% at 53.49% 33.24%, #0E0F12 0%, #08090B 22%, #000 86.5%, #000 89%)" }}
        >
            <Navigation />

            <motion.div
                className="flex w-full h-full items-center text-center overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: 'easeInOut', duration: 1.2 }}
            >

            <CameraSection
                emotion={emotion}
                emotionJson={emotionJson}
                takePhotoAndSend={takePhotoAndSend}
                videoRef={videoRef}
            />
            <TweetsSection
                tweets={tweets}
            />
            </motion.div>
        </div>
    )
}

