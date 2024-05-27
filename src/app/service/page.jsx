"use client"
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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
            setHashtags(data.result[0].emotion);

            if (status === 'authenticated') {
                fetchHashtagInterpreter(data.result[0].emotion);
            }

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
        const OPENAI_KEY = process.env.OPENAI_KEY;
        const content = JSON.stringify(emotions);
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_KEY}`,
                },
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {
                            "role": "system",
                            "content": "Te voy a dar lo siguiente: <Pregunta1>: emotion: { angry: 0.18498216522857547, disgust: 5.97595644080684e-06, fear: 0.1841661985963583, happy: 0.2677189661189914, neutral: 98.40776920318604, sad: 1.0957077145576477, surprise: 0.0006014268819853896 }, tu deberás en base a esto, decirme que hashtags podría usar para mejorar mi estado de ánimo, tu respuesta me la darás en forma de arreglo para usarse como una entrada JSON. Por ejemplo en la respuesta que te dí yo, me darás lo siguiente, solamente el arreglo, sin nada más de texto ya que usaré tu respuesta como datos para otra API: [happy, motivational, relax, beautiful, calm, asmr, sports, wildlife]"
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
                const hashtags = data.choices[0].message.content; // Asumiendo que la respuesta es un arreglo de hashtags
                await fetchTweets(hashtags);
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

    /*useEffect(() => {
        const id = setInterval(takePhotoAndSend, 5000);
        setIntervalId(id);
        return () => clearInterval(id);
    }, []);*/

    useEffect(() => {
        const id = setTimeout(takePhotoAndSend, 5000);
        setIntervalId(id);
        return () => clearTimeout(id);
    }, []);

    return (
        <div
            className="flex w-screen h-screen flex-col bg-cover items-center"
            style={{ background: "radial-gradient(37.24% 60.39% at 53.49% 33.24%, #020A20 0%, #010309 59.81%, #000 100%, #000 100%)" }}
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
                        {tweets.map((tweet, index) => (
                            <>
                                <div className="bg-gray-50 dark:bg-black p-10 flex items-center justify-center">
                                    <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 p-4 rounded-xl border max-w-xl">
                                        <div className="flex justify-between">
                                            <div className="flex items-center">
                                                <img className="h-11 w-11 rounded-full" src={tweet.tweetBy.profileImage} />
                                                <div className="ml-1.5 text-sm leading-tight">
                                                    <span className="text-black dark:text-white font-bold block ">{tweet.tweetBy.fullName}</span>
                                                    <span className="text-gray-500 dark:text-gray-400 font-normal block">@{tweet.tweetBy.userName}</span>
                                                </div>
                                            </div>
                                            <svg className="text-blue-400 dark:text-white h-6 w-auto inline-block fill-current" viewBox="0 0 24 24" class="r-1re7ezh r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g></svg>
                                        </div>
                                        <p className="text-black dark:text-white block text-xl leading-snug mt-3">{tweet.fullText}</p>
                                        {tweet.media && tweet.media.map((mediaItem, mediaIndex) => (
                                            <div key={mediaIndex} className="mt-2 rounded-2xl border border-gray-100 dark:border-gray-700">
                                                {mediaItem.type.includes('video') ? (
                                                    <video controls>
                                                        <source src={mediaItem.url} type="video/mp4" />
                                                        Your browser does not support videos.
                                                    </video>
                                                ) : (
                                                    <img src={mediaItem.url} alt="Tweet media" />
                                                )}
                                            </div>
                                        ))}
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
                                </div>
                            </>
                        ))}
                        {/* Aquí puedes agregar el contenido adicional que será scrolleable */}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}