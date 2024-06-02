export default async function saveEmotionToStatistics (detectedEmotion, user_uid, date) {
    try {
        const response = await fetch('/api/statistics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: user_uid,
                emotion: detectedEmotion,
                date: date,
            }),
        });

        if (!response.ok) {
            return response.status;
        }
    } catch (error) {
        return ('Error:', error);
    }
};