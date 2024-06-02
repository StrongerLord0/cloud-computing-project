export default function transformEmotionsData (data) {
    const translations = {
        angry: 'Enojo',
        disgust: 'Disgusto',
        fear: 'Miedo',
        happy: 'Felicidad',
        neutral: 'Neutral',
        sad: 'Tristeza',
        surprise: 'Sorpresa'
    };

    return Object.entries(data).map(([key, value]) => ({
        name: translations[key],
        value: parseFloat(value.toFixed(2))
    }));
};