"use client"
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from "../../components/navigation"
import { useSession } from 'next-auth/react'
import { format, parseISO } from 'date-fns';


export default function About() {

    const { data: session, status } = useSession();
    const videoRef = useRef(null);
    const [emotion, setEmotion] = useState('Toma una foto para analizarla...');
    const [tweets, setTweets] = useState([]);
    const [intervalId, setIntervalId] = useState(null);

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
            const detectedEmotion = data.result[0].dominant_emotion;
            setEmotion(detectedEmotion);
            fetchHashtagInterpreter(data.result[0].emotion);
            console.log('Hola');

            if (detectedEmotion !== 'No face detected in the image') {
                //clearInterval(intervalId);
                //setIntervalId(setInterval(takePhotoAndSend, 30000));
                clearTimeout(intervalId);
                setIntervalId(setTimeout(takePhotoAndSend, 30000));
            } else {
                clearTimeout(intervalId);
                setIntervalId(setTimeout(takePhotoAndSend, 5000));
            }
        } else {
            setEmotion(data.error || 'Error detecting emotion');
        }
    };

    const saveEmotionToStatistics = async (detectedEmotion) => {
        try {
            const response = await fetch('/api/statistics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: session.user._id,
                    emotion: detectedEmotion,
                    date: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                console.error('Error saving statistics:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
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
                await fetchTweets(data);
            } else {
                console.error('Error fetching hashtags:', response.status);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const fetchTweets = async (hashtagsString) => {
        try {
            const hashtags = JSON.parse(hashtagsString);
            console.log(JSON.stringify({ hashtags: hashtags }));
            const response = await fetch('/api/tweets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hashtags: hashtags }), // Asegúrate de que tu API pueda manejar esta propiedad
            });

            if (response.ok) {
                const data = await response.json();
                setTweets(data.list);
                console.log(data.list);
            } else {
                console.error('Error fetching tweets:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

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

    useEffect(() => {
        const id = setTimeout(takePhotoAndSend, 5000);
        setIntervalId(id);
        return () => clearTimeout(id);
    }, []);

    return (
        <div
            className="flex w-screen h-screen flex-col bg-cover items-center"
            style={{ background: "radial-gradient(37.24% 60.39% at 53.49% 33.24%, #0E0F12 0%, #08090B 22%, #000 86.5%, #000 89%" }}
        >
            <Navigation />

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
                            Reiniciar cámara
                        </button>
                    }
                </div>
                <div className="flex w-2/3 h-full flex-col text-center text-white items-center">
                    <div className="flex w-5/6 justify-end pb-3">
                        <div className="flex h-full overflow-hidden items-center text-center text-2xl text-gray-300">
                            {emotion}
                        </div>
                    </div>
                    <div className="flex w-5/6 h-5/6 flex-col overflow-auto items-center text-center">
                        {!tweets || tweets.length === 0 ? (
                            <div role="status">
                                <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span class="sr-only">Loading...</span>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {tweets.map((tweet, index) => (
                                    <motion.div
                                        key={tweet.id} // Ensure each tweet has a unique ID
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -50 }}
                                        transition={{ duration: 0.5 }}
                                        className="p-10 flex items-center text-left min-w-4/5"
                                    >
                                        <div index={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 p-4 rounded-xl border min-w-[700px] max-w-xl w-full">
                                            <div className="flex justify-between w-full">
                                                <div className="flex items-center w-full">
                                                    <img className="h-11 w-11 rounded-full" src={tweet.tweetBy.profileImage} />
                                                    <div className="ml-1.5 text-sm leading-tight">
                                                        <span className="text-black dark:text-white font-bold block ">{tweet.tweetBy.fullName}</span>
                                                        <span className="text-gray-500 dark:text-gray-400 font-normal block">@{tweet.tweetBy.userName}</span>
                                                    </div>
                                                </div>
                                                <div className="flex h-10 text-white">
                                                    <svg className="dark:text-white text-white fill-current" viewBox="0 0 24 24" class="r-1re7ezh r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g></svg>
                                                </div>
                                            </div>
                                            <p className="text-black dark:text-white block text-xl leading-snug mt-3 w-full">{tweet.fullText}</p>
                                            {tweet.media && tweet.media.length > 0 && (
                                                <div className="mt-2 rounded-2xl border border-gray-100 dark:border-gray-700">
                                                    {tweet.media[0].type.includes('video') ? (
                                                        <video controls>
                                                            <source src={tweet.media[0].url} type="video/mp4" />
                                                            Your browser does not support videos.
                                                        </video>
                                                    ) : (
                                                        <img src={tweet.media[0].url} alt="Tweet media" />
                                                    )}
                                                </div>
                                            )}
                                            <p className="text-gray-500 dark:text-gray-400 text-base py-1 my-0.5">{format(parseISO(new Date(tweet.createdAt).toISOString()), 'hh:mm a · MMM dd, yyyy')}</p>
                                            <div className="border-gray-200 dark:border-gray-600 border border-b-0 my-1"></div>
                                            <div className="text-gray-500 dark:text-gray-400 flex mt-3">
                                                <div className="flex items-center mr-6">
                                                    <svg className="fill-current h-5 w-auto" viewBox="0 0 24 24" class="r-1re7ezh r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path></g></svg>
                                                    <span className="ml-3">{tweet.likeCount}</span>
                                                </div>
                                                <div className="flex items-center mr-6">
                                                    <svg className="fill-current h-5 w-auto" viewBox="0 0 24 24" class="r-1re7ezh r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path></g></svg>
                                                    <span className="ml-3">{tweet.replyCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}