console.log("Hola mundo")

const extensiones = ['jpg', 'png', 'jpeg', 'tiff']

//Script para revisar extension de archivo de imagen
function checkImageExtension(extension){
    for(let i=0; i<extensiones.length; i++){
        if(extension.toLowerCase() === extensiones[i]){
            return true;
        }
    }
    return false;
}

module.exports = checkImageExtension