import EmotionsBar from "./EmotionsBar"
import { useEffect } from "react";


export default function CameraSection({ emotion, emotionJson, takePhotoAndSend, videoRef }) {

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
        <div className="flex w-1/3 h-full flex-col text-center text-white items-center justify-start border-r-4 border-r-zinc-900">
            <div id="video-container" className="w-1/3 aspect-[2/3] overflow-hidden items-center text-center rounded-lg"></div>
            {emotion === 'No face detected in the image' || emotion === 'Toma una foto para analizarla...' || emotion === '' ? (
                <>
                    <div className="py-5 w-full overflow-hidden items-center text-center text-md text-gray-300">
                        Aún no se han detectado emociones
                    </div>
                </>
            ) : (
                <>
                    <div className="py-3 w-full overflow-hidden items-center text-center text-md text-gray-300">
                        Emoción: {emotion}
                    </div>
                </>
            )}
            <button
                onClick={takePhotoAndSend}
                className="mb-4 px-4 py-1 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition"
            >
                Tomar foto
            </button>
            <EmotionsBar emotions={emotionJson} />
        </div>
    )
}