
// Test de prueba con algunas emociones de ejemplo
const emotions = ['feliz', 'triste', 'enojado', 'melancolico']

// Se comparan las emociones
function checkEmotionRec(emotion){
    for(let i=0; i<emotions.length; i++){
        if(emotion.toLowerCase() === emotions[i]){
            return true;
        }
    }
    return false;
}

module.exports = checkEmotionRec