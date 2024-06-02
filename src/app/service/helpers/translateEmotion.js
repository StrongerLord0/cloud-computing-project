export default async function translateEmotion(emotion) {
    if (emotion === 'angry') {
        return 'Enojo';
    } else if (emotion === 'disgust') {
        return 'Disgusto';
    } else if (emotion === 'fear') {
        return 'Temor';
    } else if (emotion === 'happy') {
        return 'Feliz';
    } else if (emotion === 'neutral') {
        return 'Neutral';
    } else if (emotion === 'sad') {
        return 'Triste';
    } else if (emotion === 'surprise') {
        return 'Sorpresa';
    }
}